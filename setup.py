from pathlib import Path

import setuptools

this_directory = Path(__file__).parent
long_description = (this_directory / "README.md").read_text()

setuptools.setup(
    name="st-st_multimodal_chatinput_revised_ui",
    version="1.0",
    author="FloData",
    author_email="",
    description="Streamlit component that allows you to accept multi-modal inputs through a chat interface.",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/flodata-analytics/st-multimodal-chatinput-revised-ui",
    packages=setuptools.find_packages(),
    include_package_data=True,
    classifiers=[],
    python_requires=">=3.7",
    install_requires=[
        # By definition, a Custom Component depends on Streamlit.
        # If your component has other Python dependencies, list
        # them here.
        "streamlit",
    ],
    extras_require={
        "devel": [
            "wheel",
            "pytest==7.4.0",
            "playwright==1.36.0",
            "requests==2.31.0",
            "pytest-playwright-snapshot==1.0",
            "pytest-rerunfailures==12.0",
        ]
    }
)
