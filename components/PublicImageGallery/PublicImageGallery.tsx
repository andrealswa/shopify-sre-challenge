import { Card } from '@material-ui/core';

import styles from './PublicImageGallery.module.css';

const imageData = [{ url: '1' }, { url: '2' }, { url: '3' }];

export const PublicImageGallery = (images: any) => {
  return (
    <div className={styles.container}>
      {imageData.map((image, key) => {
        return (
          <div key={key} className={styles.cardWrapper}>
            <Card className={styles.card} key={key}>
              {image.url}
            </Card>
          </div>
        );
      })}
    </div>
  );
};

