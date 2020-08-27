import { useCallback, useEffect, useState } from 'react'
import Button from '@material-ui/core/Button';
import PublishRoundedIcon from '@material-ui/icons/PublishRounded';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
// import Button from '@material-ui/core/Button';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from "react-dropzone";
import styles from "./ImageUpload.module.css"

const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: ImageInput!) {
    uploadImage(input: $input) {
      id
    }
  }
`;


export const ImageUpload = () => {
  const [uploadImage] = useMutation(UPLOAD_IMAGE);
  const [files, setFiles] = useState([]);

  const onDeleteImage = () => {
    setFiles([])
  }

  const onDrop = useCallback(files => {
    const reader = new FileReader();
    setFiles(files.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    })));

    files.forEach(file => {
      reader.readAsDataURL(file);
      reader.onload = () => {
        console.log(reader.result)
        uploadImage({ variables: { input: { path: reader.result } } });
      }

    });
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ accept: 'image/*', onDrop, maxSize: 208122 });



  const thumbs = files.map(file => (
    <div className={styles.thumbsContainer}>
      <div className={styles.thumb} key={file.name}>
        <div className={styles.thumbInner}>
          <img
            src={file.preview}
            className={styles.img}
          />
        </div>
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);

  return (
    <section className="container">
      <Card className={styles.root}>
        <CardContent>
          <div className="inputImage" {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <Button variant="contained"> <PublishRoundedIcon /> Drag and drop some files here, or click to select files</Button>
          </div>
          <Button onClick={onDeleteImage} variant="contained">Remove all Images</Button>
          <aside className={styles.thumbsContainer}>
            {thumbs}
          </aside>
        </CardContent>
      </Card>

      <Button variant="contained">Submit</Button>


    </section>


  );
};

