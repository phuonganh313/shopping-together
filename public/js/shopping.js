const domain = window.location.host;
var dir = '';
var isProductPage = window.ShopifyAnalytics.meta.page.pageType === 'product';
var currency = window.ShopifyAnalytics.meta.currency;
dir = document.querySelector('script[src*="shopping.js"]').getAttribute('src')
dir = dir.replace('/' + dir.split('/').pop(), '');
url = dir.replace("public/js", '');
$('head').append('<link rel="stylesheet" type="text/css" href="https://shoppingtogether.hamsa.site/public/css/sptapp.css" />');
if(isProductPage){
    Shopping = new Object({});
    Shopping.getSettings = function() {
        return $.ajax({
            url: url+"api/setting/get",
            dataType: 'json', 
            type : 'POST',
            data: { 'shopify_domain' : domain },
            success:function(json){
                return json;
            },
        });
    };

    var settings = Shopping.getSettings();  
    $.when(settings).done(function(settings){
        getCartRule(settings)
    });
}

window.cartRules = [];
function getCartRule (settings) {
    var productId = window.ShopifyAnalytics.meta.product.id;
    var variantId = '';
    if(getUrlParameter('variant') !== undefined && getUrlParameter('variant').length){
        variantId = getUrlParameter('variant') 
    }else{
        variantId = window.ShopifyAnalytics.meta.product.variants[0].id
    } 
    var data = {
        'variantId':variantId, 
        'id_product':productId,
        'shopify_domain': domain,
    }
    $.ajax({
        type: "POST",
        url: url+"api/cart-rule/get",
        data: data,
        success: function(cartRule){
            if((cartRule.data.length > 0)){
                window.cartRules = cartRule.data
                renderCartRule(settings, cartRule)
            }   
        },
    });
}

function renderCartRule (settings, cartRule) {
    var setting = settings.data.setting;
    $("form[action='/cart/add']").after("<div class='cart-rule'></div>");
    $(".cart-rule").append("<h3 class='spt-title'>"+setting.product_text+"</h3>")
    let total = 0;
    cartRule.data.forEach(function(product, key) {
        let optionVariants = ''
        product.variants.forEach(function(variant){
            optionVariants += "<option  value='"+variant.id_variant+"'>"+variant.title+"</option>";
        });
        let variants = '';
        if(product.variants[0].title != "Default Title"){
            variants =  "<div class='var-product'><select id='select-id-"+key+"' data-id="+key+"  class='left product-variant' onChange='onChangeSelect("+key+")'>"
                            + optionVariants
                        +"</select></div>";
        }else{  
            variants =  "<div class='var-product'><select id='select-id-"+key+"' style='display:none' data-id="+key+"  class='left product-variant' onChange='onChangeSelect("+key+")'>"
                            + optionVariants
                        +"</select></div>";
        }   
        let newPrice =  parseFloat(product.variants[0].price);
        if(product.is_main_product != 1){
            newPrice = parseFloat(product.variants[0].price) - (parseFloat(product.variants[0].price)*parseFloat(product.reduction_percent))/100;
            total += parseFloat(product.variants[0].price) - (parseFloat(product.variants[0].price)*parseFloat(product.reduction_percent))/100;
        }else{
            total += parseFloat(product.variants[0].price);
        }
        var html= 
        "<div class='related-products'>"
            +"<div class='img'>"
                +"<a href='https://"+domain+"/products/"+(product.variants[0].handle)+"' target='_blank'>"
                    +"<img id='variant-img-"+key+"' class='variant-img' src="+product.variants[0].src+" alt='Smiley face' width='90' height='90'>"
                +"</a>"
            +"</div>"
            +"<div class='info-wrap'>"
                +"<div class='name-product split-title-product' title='"+(product.variants[0].product_name)+"'><a href='https://"+domain+"/products/"+(product.variants[0].handle)+"' target='_blank'>"
                    +"<span class='left spt-product-name'>"+(product.variants[0].product_name)+"</span>"
                +"</a></div>" 
                + variants
            +"</div>"
            +"<div class='price-wrap'>"
                +"<div class='price-old'><span id='old-price-"+key+"' class='left old-price'>"+displayPrice(product.variants[0].price, currency)+"</span></div>"
                +"<div class='price-new'><span id='new-price-"+key+"' class='left new-price' data-value='"+newPrice+"'>"+displayPrice(newPrice, currency)+"</span></div>"
            +"</div>"    
        +"</div>"
        $(".cart-rule").append(html);
    });
    $(".cart-rule").append("<div class='spt-total'><span>Total</span><span class='spt-total-price'>"+displayPrice(total, currency)+"</span></div>")
    $(".cart-rule").append("<button onClick='onSubmit()' class='spt-add-to-cart' type='button'>"+setting.cart_text+"</button>")
    addCss(setting)
}

function addCss(setting) {
    $(".spt-title").css({
        "color": setting.title_font_color,
        "font-family": setting.title_font_family,
        "font-weight": setting.title_font_style == 'italic' ? '' : setting.title_font_style,
        "font-style": (setting.title_font_style == 'italic' ? setting.title_font_style : ''),
    });
    $(".spt-total-price").css({
        "color": setting.amount_font_color,
        "font-family": setting.amount_font_family,
        "font-weight": setting.amount_font_style == 'italic' ? '' : setting.amount_font_style,
        "font-style": (setting.amount_font_style == 'italic' ? setting.amount_font_style : ''),
    });
    $(".spt-add-to-cart").css({
        "color": setting.cart_font_color,
        "font-family": setting.cart_font_family,
        "font-weight": setting.cart_font_style == 'italic' ? '' : setting.cart_font_style,
        "font-style": (setting.cart_font_style == 'italic' ? setting.cart_font_style : ''),
        "background-color": setting.back_ground_color
    });
    $(".new-price").css({
        "color": setting.new_price_font_color,
        "font-family": setting.new_price_font_family,
        "font-weight": setting.new_price_font_style == 'italic' ? '' : setting.new_price_font_style,
        "font-style": (setting.new_price_font_style == 'italic' ? setting.new_price_font_style : ''),
    });
    $(".old-price").css({
        "color": setting.old_price_font_color,
        "font-family": setting.old_price_font_family,
        "font-weight": setting.old_price_font_style == 'italic' ? '' : setting.old_price_font_style,
        "font-style": (setting.old_price_font_style == 'italic' ? setting.old_price_font_style : ''),
    });
    $(".spt-product-name").css({
        "color": setting.product_font_color,
        "font-family": setting.product_font_family,
        "font-weight": setting.product_font_style == 'italic' ? '' : setting.product_font_style,
        "font-style": (setting.product_font_style == 'italic' ? setting.product_font_style : ''),
    });
}

function onChangeSelect(key) {
    let cartRule = cartRules[key];
    var idVariant = document.getElementById("select-id-"+key+"").value;
    var variant = cartRule.variants.find(x => x.id_variant === idVariant);
    if(cartRule.is_main_product != 1){
        let newPrice = parseFloat(variant.price);
        newPrice = parseFloat(variant.price) - (parseFloat(variant.price)*parseFloat(cartRule.reduction_percent))/100;
        $("#old-price-"+key+"").html(""+displayPrice(variant.price,currency)+"");
        $("#new-price-"+key+"").html(displayPrice(newPrice,currency));
        $("#new-price-"+key+"").attr('data-value', newPrice);
    }else{
        $("#old-price-"+key+"").html(""+displayPrice(variant.price,currency)+"");
        $("#new-price-"+key+"").html(""+displayPrice(variant.price,currency)+"");
    }
    $("#variant-img-"+key+"").attr('src', variant.src);
    let total = 0;
    $(".related-products").each(function() {
        total += parseFloat($(this).find(".new-price").attr('data-value'));
    });
    $(".spt-total-price").html(""+displayPrice(total,currency)+"");
}

function onSubmit() {
    var variants = [];              
    $(".related-products").each(function(i){
        let obj = {};
        obj['quantity'] = 1;
        obj['id'] = parseInt($("#select-id-"+i+"").val());
        variants.push(obj);
    })
    var deferreds = [];
    variants.forEach(function(e) {
        deferreds.push(addToCart(e));
    });
    $.when.apply($, deferreds).done(function() { 
        $.ajax({
            type: "GET",
            url: "https://"+domain+"/discount/"+cartRules.shift().code+"",
        });
        $.ajax({
            url: url+"api/cart-rule/add-to-cart",
            dataType: 'json', 
            type: "POST",
            data: {
                'id_shop': cartRules.shift().id_shop,
                'id_cart_rule': cartRules.shift().id
            },
            success: function(result){
                window.location.replace('/cart')
            },
            error: function (error) {
            }
        });
    })
}

function addToCart (item) {
    return $.ajax({
        type: "POST",
        url: "https://"+domain+"/cart/add.js",
        dataType: 'json',
        data: item,
        async:false,
        success: function(result){

        },
        error: function (error) {

        }
    });
}

var getUrlParameter = function(param) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === param) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
}

function displayPrice(price, currency, showCurrencySymbol = true) {
	price = parseFloat(price);
	if (typeof currency == "undefined") {
		return psRound(price);
	}
	price = psRound(price);
    price = formatNumber(price, 2, ",", ".") + " " + currency;
	return showCurrencySymbol
		? price
		: String(price).replace(currency, "");
}

function formatNumber(value, numberOfDecimal, thousenSeparator, virgule) {
	value = value.toFixed(numberOfDecimal);
	let valString = value + "";
	let tmp = valString.split(".");
	let absValString = tmp.length === 2 ? tmp[0] : valString;
	let decimalString = ("0." + (tmp.length === 2 ? tmp[1] : 0)).substr(2);
	let nb = absValString.length;

	for (let i = 1; i < 4; i++)
		if (value >= Math.pow(10, 3 * i))
			absValString =
				absValString.substring(0, nb - 3 * i) +
				thousenSeparator +
				absValString.substring(nb - 3 * i);

	if (parseInt(numberOfDecimal) === 0) return absValString;
	return absValString + virgule + (decimalString > 0 ? decimalString : "00");
}

function psRound(value, places, roundMode) {
	if (typeof roundMode === "undefined") roundMode = 2;
	if (typeof places === "undefined") places = 2;
	let method = parseInt(roundMode);
	if (method === 0) return ceilf(value, parseInt(places));
	else if (method === 1) return floorf(value, parseInt(places));
	else if (method === 3 || method === 4 || method === 5) {
		// From PHP Math.c
		let precisionPlaces = 14 - Math.floor(psLog10(Math.abs(value)));
		let f1 = Math.pow(10, Math.abs(places));
		let tmpValue = 0;

		if (precisionPlaces > places && precisionPlaces - places < 15) {
			let f2 = Math.pow(10, Math.abs(precisionPlaces));
			if (precisionPlaces >= 0) tmpValue = value * f2;
			else tmpValue = value / f2;

			tmpValue = psRoundHelper(tmpValue, roundMode);

			/* now correctly move the decimal point */
			f2 = Math.pow(10, Math.abs(places - precisionPlaces));
			/* because places < precisionPlaces */
			tmpValue /= f2;
		} else {
			/* adjust the value */
			if (places >= 0) tmpValue = value * f1;
			else tmpValue = value / f1;

			if (Math.abs(tmpValue) >= 1e15) return value;
		}

		tmpValue = psRoundHelper(tmpValue, roundMode);
		if (places > 0) tmpValue = tmpValue / f1;
		else tmpValue = tmpValue * f1;

		return tmpValue;
	} else {
		return psRoundHalfUp(value, parseInt(places));
	}
}

function ceilf(value, precision) {
	if (typeof precision === "undefined") precision = 0;
	let precisionFactor = precision === 0 ? 1 : Math.pow(10, precision);
	let tmp = value * precisionFactor;
	let tmp2 = tmp.toString();
	if (tmp2[tmp2.length - 1] === 0) return value;
	return Math.ceil(value * precisionFactor) / precisionFactor;
}

function psRoundHalfUp(value, precision) {
	let mul = Math.pow(10, precision);
	let val = value * mul;

	let nextDigit = Math.floor(val * 10) - 10 * Math.floor(val);
	if (nextDigit >= 5) val = Math.ceil(val);
	else val = Math.floor(val);

	return val / mul;
}

function psRoundHelper(value, mode) {
	let tmpValue = 0;
	// From PHP Math.c
	if (value >= 0.0) {
		tmpValue = Math.floor(value + 0.5);
		if (
			(mode == 3 && value == -0.5 + tmpValue) ||
			(mode == 4 && value == 0.5 + 2 * Math.floor(tmpValue / 2.0)) ||
			(mode == 5 && value == 0.5 + 2 * Math.floor(tmpValue / 2.0) - 1.0)
		)
			tmpValue -= 1.0;
	} else {
		tmpValue = Math.ceil(value - 0.5);
		if (
			(mode == 3 && value == 0.5 + tmpValue) ||
			(mode == 4 && value == -0.5 + 2 * Math.ceil(tmpValue / 2.0)) ||
			(mode == 5 && value == -0.5 + 2 * Math.ceil(tmpValue / 2.0) + 1.0)
		)
			tmpValue += 1.0;
	}

	return tmpValue;
}

function floorf(value, precision) {
	if (typeof precision === "undefined") precision = 0;
	let precisionFactor = precision === 0 ? 1 : Math.pow(10, precision);
	let tmp = value * precisionFactor;
	let tmp2 = tmp.toString();
	if (tmp2[tmp2.length - 1] === 0) return value;
	return Math.floor(value * precisionFactor) / precisionFactor;
}

function psLog10(value) {
	return Math.log(value) / Math.LN10;
}
