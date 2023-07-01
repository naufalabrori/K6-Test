import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 },
    { duration: '15', target: 10 },
    { duration: '10s', target: 0 }
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'] // Mengatur threshold agar persentase 95% dari permintaan HTTP memiliki durasi kurang dari 500ms
  }
};

export default function () {
  // Membuat user baru
  let createUserPayload = JSON.stringify({
    name: 'morpheus',
    job: 'leader'
  });
  let createUserParams = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let createUserResponse = http.post('https://reqres.in/api/users', createUserPayload, createUserParams);

  // Memeriksa respons untuk membuat user
  check(createUserResponse, {
    'Create User - Status is 201': (res) => res.status === 201,
    'Create User - User ID exists': (res) => res.json('id') !== null
  });

  sleep(1); // Menunggu 1 detik sebelum melanjutkan ke tes berikutnya

  // Mengupdate user yang ada
  let updateUserPayload = JSON.stringify({
    name: 'morpheus',
    job: 'zion resident'
  });
  let updateUserParams = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  let updateUserResponse = http.put('https://reqres.in/api/users/2', updateUserPayload, updateUserParams);

  // Memeriksa respons untuk mengupdate user
  check(updateUserResponse, {
    'Update User - Status is 200': (res) => res.status === 200,
    'Update User - Updated Job': (res) => res.json('job') === 'zion resident'
  });

  sleep(1); // Menunggu 1 detik sebelum melanjutkan ke tes berikutnya
}
