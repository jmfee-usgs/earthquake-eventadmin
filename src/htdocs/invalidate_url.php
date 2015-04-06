<?php

// always run inside a session
session_start();


if (!isset($_POST['path'])) {
  header('400 Bad Request');
  echo 'product parameter required';
  exit();
}
$path = $_POST['path'];


include_once '../conf/config.inc.php';
$hostnames = trim($CONFIG['SQUID_HOSTNAMES']);
$servers = trim($CONFIG['SQUID_SERVERS']);
if ($hostnames === '' || $servers === '') {
  header('HTTP/1.0 400 Bad Request');
  echo 'Cache Invalidation not configured';
  exit();
}
$hostnames = array_map('trim', explode(',', $hostnames));
$servers = array_map('trim', explode(',', $servers));


try {
  // squid invalidation
  $results = array();
  foreach ($servers as $server) {
    foreach ($hostnames as $hostname) {
      $url = $server . $path;
      $ch = curl_init($url);
      curl_setopt_array($ch, array(
        CURLOPT_CUSTOMREQUEST => 'PURGE',
        CURLOPT_HTTPHEADER => array(
          'Host: ' . $hostname
        )
      ));
      curl_exec($ch);
      $results[$server][$hostname] = curl_getinfo($ch, CURLINFO_HTTP_CODE);
      curl_close($ch);
    }
  }

  // TODO: akamai Invalidation
  // AKAMAI CCU docs:
  // https://api.ccu.akamai.com/ccu/v2/docs/index.html

  header('Content-type: application/json');
  echo json_encode($results);
} catch (Exception $e) {
  header('HTTP/1.0 400 Bad Request');
  echo 'Bad request, error has been logged on server';
  // log error on server
  trigger_error($e->getMessage());
}
