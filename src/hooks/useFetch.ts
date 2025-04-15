import { useState, useEffect } from "react";

interface UseFetchResult {
  response: any | null;
  isPending: boolean;
  error: any | null;
}

export default function useFetch(url: string): UseFetchResult {
  const [response, setResponse] = useState<any | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    setTimeout(() => {
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw Error("Error fetching data");
          }
          return res.json();
        })
        .then((response) => {
          setResponse(response);
          setIsPending(false);
          setError(null);
        })
        .catch((err) => {
          setIsPending(false);
          setError(err.message);
        });
    }, 1000);
  }, [url]);

  return { response, isPending, error };
}
