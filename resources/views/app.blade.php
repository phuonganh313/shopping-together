<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>Shopping Together</title>
        <!-- Fonts -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous"> -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet" type="text/css">
        <link rel="stylesheet" href="https://sdks.shopifycdn.com/polaris/3.0.0-rc.6/polaris.min.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
        <link rel="stylesheet" href="../public/css/shopping.css">

        <!-- Styles -->
        <style>
            html, body {
                background-color: #fff;
                color: #636b6f;
                font-family: 'Nunito', sans-serif;
                font-weight: normal;
                height: auto;
                margin: 0;
            }

            .full-height {
                height: auto;
            }

            .flex-center {
                align-items: center;
                display: flex;
                justify-content: center;
            }

            .position-ref {
                position: relative;
            }

            .top-right {
                position: absolute;
                right: 10px;
                top: 18px;
            }

            .content {
                text-align: center;
            }

            .title {
                font-size: 84px;
            }

            .links > a {
                color: #636b6f;
                padding: 0 25px;
                font-size: 13px;
                font-weight: 600;
                letter-spacing: .1rem;
                text-decoration: none;
                text-transform: uppercase;
            }

            .m-b-md {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <div id="root"></div>
        @if(config('shopify-app.mode'))
            @if(config('shopify-app.esdk_enabled'))
                <script src="https://cdn.shopify.com/s/assets/external/app.js?{{ date('YmdH') }}"></script>
                <script type="text/javascript">
                    ShopifyApp.init({
                        apiKey: '{{ config('shopify-app.api_key') }}',
                        shopOrigin: 'https://{{ ShopifyApp::shop()->shopify_domain }}',
                        debug: false,
                        forceRedirect: true
                    });
                </script>
                @include('shopify-app::partials.flash_messages')
            @endif
            <script>
                var domain = "{{ ShopifyApp::shop()->shopify_domain }}";
                var lang = <?php echo $lang ?>;
            </script>
        @else
            <script>
                var domain = "sptapp.myshopify.com";
                var lang = <?php echo $lang ?>;
            </script>
        @endif
        <script src="../resources/js/dist/bundle.js"></script>
    </body>
</html>
