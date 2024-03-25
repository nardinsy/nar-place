const sendHttpRequest = async (address, requestOptions) => {
  try {
    const response = await fetch(address, requestOptions);

    if (response.ok) {
      const data = await response.json();
      return data;
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sendHttpRequest;
