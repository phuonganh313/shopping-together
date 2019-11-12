<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8" />
        <base target="_top">

        <title>Redirecting...</title>

        <script type="text/javascript">
            var scope = "{{$scope}}";
            var apiRedirect = "{{$api_redirect}}";
            var shopDomain = "{{$shopDomain}}";
            var key = "{{$key}}";
            // If the current window is the 'parent', change the URL by setting location.href
            if (window.top == window.self) {
                window.top.location.href = 'https://' + shopDomain + '/admin/oauth/request_grant?' + 'client_id=' + key + '&redirect_uri=' + apiRedirect + '&scope=' + scope;
            // If the current window is the 'child', change the parent's URL with postMessage
            } else {
                normalizedLink = document.createElement('a');
                normalizedLink.href = "{{ $authUrl }}";
                data = JSON.stringify({
                    message: 'Shopify.API.remoteRedirect',
                    data: { location: normalizedLink.href }
                });
                window.parent.postMessage(data, "https://{{ $shopDomain }}");
            }
        </script>
    </head>
    <body>
    </body>
</html>
