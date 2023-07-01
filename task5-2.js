import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";

export let options = {
  vus: 1000, // Total 1000 pengguna virtual
  duration: '30s', // Durasi pengujian selama 30 detik
  iterations: 3500, // Total 3500 iterasi
  thresholds: {
    http_req_duration: ['p(95)<2000'] // Mengatur threshold agar persentase 95% dari permintaan HTTP memiliki durasi kurang dari 2000ms (2 detik)
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

export function handleSummary(data) {
    return {
      "summary.html": htmlReport(data),
    };
  }
