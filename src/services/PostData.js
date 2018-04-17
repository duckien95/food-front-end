
export function PostData(type, userData) {
    // let BaseURL = 'https://apipaypal.9lessons.info/apipaypal/';
    // let BaseURL = 'http://localhost:8000/auth/';
    // console.log(userData);

    // axios.post('http://localhost:8000/auth/signup', { body : userData }).then(res => {
    //     console.log(res);
    // });

    return new Promise((resolve, reject) =>{
        
      fetch('http://localhost:8000/auth/signup', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: JSON.stringify(userData)
      })
      .then((response) => response.json())
      .then((res) => {
        console.log("PostData 30" + res);
        console.log("PostData 31 fetch success");
        resolve(res);
      })
      .catch((error) => {
        reject(error);
        console.log("fetch err");
      });
    //
    });


}
