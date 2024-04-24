export interface MyRequestOptions {
  // method: "GET" | "POST" | "PATCH" | "DELETE";
  method: string;
  headers: any;
  body?: string;
}

const sendHttpRequest = async (
  address: string,
  requestOptions: MyRequestOptions
) => {
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
