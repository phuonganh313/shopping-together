<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Namespace
    |--------------------------------------------------------------------------
    |
    | This option allows you to set a namespace.
    | Useful for multiple apps using the same database instance.
    | Meaning, one shop can be part of many apps on the same database.
    |
    */

    'namespace' => env('SHOPIFY_APP_NAMESPACE', null),

    /*
    |--------------------------------------------------------------------------
    | Shop Model
    |--------------------------------------------------------------------------
    |
    | This option is for overriding the shop model with your own.
    |
    */

    'shop_model' => env('SHOPIFY_SHOP_MODEL', '\OhMyBrew\ShopifyApp\Models\Shop'),

    /*
    |--------------------------------------------------------------------------
    | ESDK Mode
    |--------------------------------------------------------------------------
    |
    | ESDK (embedded apps) are enabled by default. Set to false to use legacy
    | mode and host the app inside your own container.
    |
    */

    'esdk_enabled' => (bool) env('SHOPIFY_ESDK_ENABLED', true),

    /*
    |--------------------------------------------------------------------------
    | Shopify App Name
    |--------------------------------------------------------------------------
    |
    | This option simply lets you display your app's name.
    |
    */

    'app_name' => env('SHOPIFY_APP_NAME', 'Shopping together'),

    /*
    |--------------------------------------------------------------------------
    | Shopify API Key
    |--------------------------------------------------------------------------
    |
    | This option is for the app's API key.
    |
    */

    'api_key' => env('SHOPIFY_API_KEY', ''),
    
    'domain' => env('SHOPIFY_API_DOMAIN', 'https://0740358a.ngrok.io/authenticate'),

    /*
    |--------------------------------------------------------------------------
    | Shopify API Secret
    |--------------------------------------------------------------------------
    |
    | This option is for the app's API secret.
    |
    */

    'api_secret' => env('SHOPIFY_API_SECRET', ''),

    /*
    |--------------------------------------------------------------------------
    | Shopify API Scopes
    |--------------------------------------------------------------------------
    |
    | This option is for the scopes your application needs in the API.
    |
    */

    'api_scopes' => env('SHOPIFY_API_SCOPES', 'read_products,write_themes,read_themes,write_script_tags,read_price_rules,write_price_rules,read_orders'),

    /*
    |--------------------------------------------------------------------------
    | Shopify API Redirect
    |--------------------------------------------------------------------------
    |
    | This option is for the redirect after authentication.
    |
    */

    'api_redirect' => env('SHOPIFY_API_REDIRECT', '/authenticate'),

    /*
    |--------------------------------------------------------------------------
    | Shopify API class
    |--------------------------------------------------------------------------
    |
    | This option option allows you to change out the default API class
    | which is OhMyBrew\BasicShopifyAPI. This option is mainly used for
    | testing and does not need to be changed unless required.
    |
    */

    'api_class' => env('SHOPIFY_API_CLASS', \OhMyBrew\BasicShopifyAPI::class),

    /*
    |--------------------------------------------------------------------------
    | Shopify "MyShopify" domain
    |--------------------------------------------------------------------------
    |
    | The internal URL used by shops. This will not change but in the future
    | it may.
    |
    */

    'myshopify_domain' => 'myshopify.com',

    /*
    |--------------------------------------------------------------------------
    | Enable Billing
    |--------------------------------------------------------------------------
    |
    | Enable billing component to the package.
    |
    */

    'billing_enabled' => (bool) env('SHOPIFY_BILLING_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Enable Freemium Mode
    |--------------------------------------------------------------------------
    |
    | Allow a shop use the app in "freemium" mode.
    | Shop will get a `freemium` flag on their record in the table.
    |
    */

    'billing_freemium_enabled' => (bool) env('SHOPIFY_BILLING_FREEMIUM_ENABLED', false),

    /*
    |--------------------------------------------------------------------------
    | Billing Redirect
    |--------------------------------------------------------------------------
    |
    | Required redirection URL for billing when
    | a customer accepts or declines the charge presented.
    |
    */

    'billing_redirect' => env('SHOPIFY_BILLING_REDIRECT', '/billing/process'),

    /*
    |--------------------------------------------------------------------------
    | Shopify Webhooks
    |--------------------------------------------------------------------------
    |
    | This option is for defining webhooks.
    | Key is for the Shopify webhook event
    | Value is for the endpoint to call
    |
    */

    'webhooks' => [
        [
            'topic' => env('SHOPIFY_WEBHOOK_1_TOPIC', 'app/uninstalled'),
            'address' => env('SHOPIFY_WEBHOOK_1_UNINSTALL', ''),
        ],
        [
            'topic' => env('SHOPIFY_WEBHOOK_1_TOPIC', 'products/create'),
            'address' => env('SHOPIFY_WEBHOOK_1_SAVE_PRODUCT', ''),
        ],
        [
            'topic' => env('SHOPIFY_WEBHOOK_1_TOPIC', 'products/delete'),
            'address' => env('SHOPIFY_WEBHOOK_1_DELETE_PRODUCT', ''),
        ],
        [
            'topic' => env('SHOPIFY_WEBHOOK_1_TOPIC', 'products/update'),
            'address' => env('SHOPIFY_WEBHOOK_1_SAVE_PRODUCT', ''),
        ],
        [
            'topic' => env('SHOPIFY_WEBHOOK_1_TOPIC', 'orders/create'),
            'address' => env('SHOPIFY_WEBHOOK_1_ORDER', ''),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Shopify ScriptTags
    |--------------------------------------------------------------------------
    |
    | This option is for defining scripttags.
    |
    */

    'scripttags' => [
        [
            'src' => env('SHOPIFY_SCRIPTTAG_1_SRC', ''),
            'event' => env('SHOPIFY_SCRIPTTAG_1_EVENT', 'onload'),
            'display_scope' => env('SHOPIFY_SCRIPTTAG_1_DISPLAY_SCOPE', 'online_store')
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | After Authenticate Job
    |--------------------------------------------------------------------------
    |
    | This option is for firing a job after a shop has been authenticated.
    | This, like webhooks and scripttag jobs, will fire every time a shop
    | authenticates, not just once.
    |
    */

    'after_authenticate_job' => [
        /*
            [
                'job' => env('AFTER_AUTHENTICATE_JOB'), // example: \App\Jobs\AfterAuthenticateJob::class
                'inline' => env('AFTER_AUTHENTICATE_JOB_INLINE', false) // False = execute inline, true = dispatch job for later
            ],
        */
    ],

    'mode' => env('MODE', true),  // mode = true (live site), false (local)
];
