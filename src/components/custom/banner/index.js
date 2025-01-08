import React, { useState, useEffect } from "react";
import { AdaptableCard, DoubleSidedImage } from "components/shared";
import { Upload } from "components/ui";
import appConfig from "configs/app.config";

const BannerImage = ({
  touched,
  errors,
  title,
  values,
  setFieldValue,
  file,
}) => {
  const [image, setImage] = useState(file);

  const ImageHandler = (e) => {
    const newFile = e[0];
    setImage(URL.createObjectURL(newFile));
    setFieldValue("file", newFile);
  };

  useEffect(() => {
    if (file) {
      setImage(file);
    }
  }, [file]);

  return (
    <AdaptableCard className="mb-4" divider>
      <h5>{title}</h5>
      {!!(values?.file?.name || values?.file?.original || image) && (
        <div className="flex flex-col justify-end w-40">
          <img
            className="my-5 rounded-xl"
            src={
              !!image
                ? image
                : `${appConfig.imageBaseUrl}${values?.file?.original}?tr=w-300,h-200`
            }
            alt="Selected"
          />
        </div>
      )}
      <Upload
        draggable
        name="file"
        uploadLimit={1}
        accept="image/*"
        showList={false}
        onChange={(e) => ImageHandler(e)}
      >
        <div className="text-center">
          <DoubleSidedImage
            className="mx-auto"
            src="/img/others/upload.png"
            darkModeSrc="/img/others/upload-dark.png"
          />
          <p className="font-semibold">
            <span className="text-gray-800 dark:text-white">
              Drop your image here, or{" "}
            </span>
            <span className="text-blue-500">browse</span>
          </p>
          <p className="mt-1 opacity-60 dark:text-white">
            Support: jpeg, png, svg
          </p>
        </div>
      </Upload>
    </AdaptableCard>
  );
};

export default BannerImage;
