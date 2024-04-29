export interface MyRequestOptions {
  // method: "GET" | "POST" | "PATCH" | "DELETE";
  method: string;
  headers?: any;
  body?: string;
}

const sendHttpRequest = async (
  address: string,
  requestOptions: MyRequestOptions
) => {
  try {
    const response = await fetch(address, requestOptions);

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default sendHttpRequest;
