import React, { ReactNode } from "react"
import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import "./styles.css"

interface State {
  uploadedImages: string[]
  textInput: string
}

class MultimodalChatInput extends StreamlitComponentBase<State> {
  private disabledStyle = {
    opacity: 0.5,
    cursor: "not-allowed",
  }

  public state = {
    uploadedImages: [],
    textInput: "",
  }

  handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // this.setState({ textInput: event.target.value })
  }

  handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.processFiles(event.target.files)
  }

  handleRemoveImage = (indexToRemove: number) => {
    this.setState((prevState) => ({
      uploadedImages: prevState.uploadedImages.filter(
        (_, index) => index !== indexToRemove
      ),
    }))
  }

  handleSubmit = () => {
    Streamlit.setComponentValue({
      images: this.state.uploadedImages,
      text: this.state.textInput,
    })

    // Clear state after sending
    this.setState({
      uploadedImages: [],
      textInput: "",
    })
  }

  handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const clipboardData = event.clipboardData
    const items = clipboardData.items

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith("image")) {
        const blob = items[i].getAsFile()
        if (blob) {
          // Ensure blob is not null before proceeding
          const reader = new FileReader()

          reader.onloadend = () => {
            this.setState((prevState) => ({
              uploadedImages: [
                ...prevState.uploadedImages,
                reader.result as string,
              ],
            }))
          }
          reader.readAsDataURL(blob)
          event.preventDefault() // Prevent the image from being pasted as text
        }
      }
    }
  }

  processFiles = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        this.setState((prevState) => ({
          uploadedImages: [
            ...prevState.uploadedImages,
            reader.result as string,
          ],
        }))
      }
      reader.readAsDataURL(file)
    })
  }

  public render = (): ReactNode => {
    const disabled = this.props.args["disabled"]
    const isdisabled = this.props.disabled || disabled
    const width = this.props.width

    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          border: "1px solid transparent",
          borderRadius: "8px",
          padding: "8px",
          width: width,
          background: "rgb(240, 242, 246)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {this.state.uploadedImages.map((image, index) => (
            <div
              key={index}
              aria-disabled={this.props.disabled || disabled}
              style={{
                position: "relative",
                display: "inline-block",
                margin: "0px 5px 5px 5px",
                transition: "0.3s",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <img
                src={image}
                alt="Uploaded preview"
                style={{ width: "50px", height: "50px" }}
              />
              <button
                disabled={isdisabled}
                onClick={() => this.handleRemoveImage(index)}
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  border: "none",
                  width: "15px",
                  height: "15px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  ...(isdisabled ? this.disabledStyle : {}),
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="11" viewBox="0 0 352 512" fill="white" className="cross_styling"><path d="M242.7 256l100.1-100.1c12.3-12.3 12.3-32.2 0-44.5l-22.2-22.2c-12.3-12.3-32.2-12.3-44.5 0L176 189.3 75.9 89.2c-12.3-12.3-32.2-12.3-44.5 0L9.2 111.5c-12.3 12.3-12.3 32.2 0 44.5L109.3 256 9.2 356.1c-12.3 12.3-12.3 32.2 0 44.5l22.2 22.2c12.3 12.3 32.2 12.3 44.5 0L176 322.7l100.1 100.1c12.3 12.3 32.2 12.3 44.5 0l22.2-22.2c12.3-12.3 12.3-32.2 0-44.5L242.7 256z"/></svg>
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center" }}>
          <textarea
          className="img_input"
            value={this.state.textInput}
            onChange={this.handleInputChange}
            onPaste={this.handlePaste}
            placeholder="Paste image (Ctrl+V)"
            style={{
              flexGrow: 1,
              padding: "8px",
              borderRadius: "8px",
              backgroundColor: "white",
              overflow: "auto",
              resize: "none",
              border: "1px solid rgb(204, 204, 204)",
              ...(isdisabled ? this.disabledStyle : {}),
            }}
            rows = {1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                // Only ENTER -> Emulate send button press
                e.preventDefault()
                this.handleSubmit()
              }
            }}
          />

          <button
            disabled={isdisabled}
            onClick={this.handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "10px",
              width: "42px",
              height: "42px",
              fontSize: "22px",
              border: "none",
              ...(isdisabled ? this.disabledStyle : {}),
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="16"
              width="14"
              viewBox="0 0 448 512"
              fill="grey"
            >
              <path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z" />
            </svg>
          </button>
        </div>
      </div>
    )
  }
}

export default withStreamlitConnection(MultimodalChatInput)
