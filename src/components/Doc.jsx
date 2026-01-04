const DocIframe = ({ source }) => {
  if (!source) return <div>Loading...</div>;

  const previewUrl = source.includes('/document/')
    ? source.replace(/\/edit.*$/, '') + '/preview'
    : source;

  return (
    <iframe
      src={previewUrl}
      title="Google Doc Preview"
      width="100%"
      height="600"
      style={{ border: 'none' }}
    />
  );
};

export default DocIframe;
