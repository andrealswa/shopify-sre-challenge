import { useCallback } from 'react'
// import Button from '@material-ui/core/Button';
import { gql, useMutation } from '@apollo/client';
import { useDropzone } from "react-dropzone";

const UPLOAD_IMAGE = gql`
  mutation UploadImage($input: ImageInput!) {
    uploadImage(input: $input) {
      id
    }
  }
`;

export const ImageUpload = () => {
  const [uploadImage] = useMutation(UPLOAD_IMAGE);

  const onDrop = useCallback(files => {
    const reader = new FileReader();

    files.forEach(file => {
      reader.readAsDataURL(file);
      reader.onload = () =>
        uploadImage({ variables: { input: { path: reader.result } } });
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drop Images Here For Upload</p>
    </div>
  );
};

