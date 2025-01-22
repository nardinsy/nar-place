const Avatar = ({
  cssClassName,
  pictureUrl,
  alt,
  width,
}: {
  cssClassName?: string;
  pictureUrl: string | undefined;
  alt: string | undefined;
  width: string;
}) => {
  //if pictureUrl is not undefined but it is not valid url, then what?

  const content = pictureUrl ? (
    <img
      data-testid="image"
      src={pictureUrl}
      alt={alt}
      style={{ width, height: width }}
      className={`block rounded-full w-full h-full object-cover ${cssClassName}`}
      loading="lazy"
    />
  ) : (
    <i
      data-testid="no-image"
      className={`bx bx-user-circle block rounded-full w-full h-full object-cover ${cssClassName}`}
      style={{ width, height: width }}
    />
  );

  return (
    <div className={`text-5xl text-gray-light ${cssClassName}`}>{content}</div>
  );
};

export default Avatar;
