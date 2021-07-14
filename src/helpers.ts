import axios, { AxiosResponse } from "axios";

export const getAllPassingPromises = async (promises: Promise<any>[]) => {
  const results = await Promise.all(promises.map((p) => p.catch((e) => e)));
  return (promises = results.filter((result) => !(result instanceof Error)));
};

export const getIncreamentingAxiosPages: (
  rootUrl: string
) => Promise<AxiosResponse<any>[]> = async (rootUrl: string) => {
  let is404: boolean = false;
  let i: number = 0;
  const axiosResponses: AxiosResponse<any>[] = [];

  while (!is404) {
    i++;
    try {
      const response = await axios.get(rootUrl + `page/${i}`);

      axiosResponses.push(response);
    } catch (e) {
      is404 = true;
      break;
    }
  }
  return axiosResponses;
};
