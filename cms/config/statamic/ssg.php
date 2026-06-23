<?php

return [

    // Where the static site will eventually be hosted. Set APP_URL to the live
    // domain before generating for production.
    'base_url' => config('app.url'),

    // Where the generated static files are written (the folder you upload).
    'destination' => storage_path('app/static'),

    // Directories copied alongside the generated HTML. `assets` carries the
    // images uploaded through the control panel into the static output.
    'copy' => [
        public_path('build') => 'build',
        public_path('assets') => 'assets',
    ],

    'symlinks' => [
        //
    ],

    'urls' => [
        //
    ],

    'exclude' => [
        //
    ],

    'enforce_trailing_slashes' => false,

    'pagination_route' => '{url}/{page_name}/{page_number}',

    'glide' => [
        'directory' => 'img',
        'override' => true,
    ],

    'failures' => false,

];
