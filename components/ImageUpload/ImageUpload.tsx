import { useState, useEffect } from 'react'
import ImageUploading from "react-images-uploading";
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import Button from '@material-ui/core/Button';

import aws from 'aws-sdk'

export const ImageUpload = () => {


  const [images, setImages] = useState([]);
  const maxNumber = 100;
  const onChange = (imageList, addUpdateIndex) => {
    // data for submit
    console.log(imageList, addUpdateIndex);
    setImages(imageList);
  };


  // for seeing the contents of the image objects
  // useEffect(() => {
  //   images.forEach(image => {
  //     console.log(image)
  //   })
  // }, [images])

  const handleImageUpload = () => {
    console.log(images)
  }

  return (
    <div className="App">
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({
          imageList,
          onImageUpload,
          onImageRemoveAll,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
            // write your building UI
            <div className="upload__image-wrapper">
              <Button
                variant="contained"
                style={isDragging ? { color: "red" } : null}
                onClick={onImageUpload}
                {...dragProps}
              >
                <PublishRoundedIcon />
                Click or Drop here
            </Button>
            &nbsp;
              <Button variant="contained" onClick={onImageRemoveAll}>Remove all images</Button>
              {imageList.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.data_url} alt="" width="100" />
                  <div className="image-item__btn-wrapper">
                    <Button onClick={() => onImageUpdate(index)}>Update</Button>
                    <Button onClick={() => onImageRemove(index)}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </ImageUploading>
      <Button onClick={handleImageUpload}>Upload Images</Button>
    </div>
  );
};

