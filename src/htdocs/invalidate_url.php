<?php

/**

// TODO: sanitize path
// AKAMAI CCU docs:
// https://api.ccu.akamai.com/ccu/v2/docs/index.html

*/


// always run inside a session
session_start();

if (!isset($_POST['path'])) {
  header('400 Bad Request');
  echo 'product parameter required';
  exit();
}

$path = $_POST['path'];
$path = '/earthquakes/eventpage/usc000nzvd';

$hostnames = array(
  'earthquake.usgs.gov',
  'dev-earthquake.cr.usgs.gov',
  'dev01-earthquake.cr.usgs.gov'
);

$servers = array(
  'http://dev01-cache01.cr.usgs.gov',
  'http://dev01-cache02.cr.usgs.gov'
);




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

header('Content-type: application/json');
echo json_encode($results);
