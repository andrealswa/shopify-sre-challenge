import { ImageUpload } from '../components/ImageUpload/ImageUpload'
import { PrivateImageGallery } from '../components/PrivateImageGallery/PrivateImageGallery';

const imagegallery = () => {
  return (
    <div>
      <ImageUpload />
      <PrivateImageGallery />
    </div>
  );
};
export default imagegallery;
