import superagent from "superagent";

export default {
    saveSetting(data){
        return superagent.post('/api/setting/save').send({
            'shopify_domain': domain,
            'title_font_family': data.titleFontFamily,
            'title_font_style': data.titleFontStyle,
            'title_font_size': data.titleFontSize,
            'title_font_color': data.titleFontColor,
            'product_font_family': data.productFontFamily,
            'product_font_style': data.productFontStyle,
            'product_font_size': data.productFontSize,
            'product_font_color': data.productFontColor,
            'amount_font_family': data.amountFontFamily,
            'amount_font_style': data.amountFontStyle,
            'amount_font_size': data.amountFontSize,
            'amount_font_color': data.amountFontColor,
            'new_price_font_family': data.newPriceFontFamily,
            'new_price_font_style': data.newPriceFontStyle,
            'new_price_font_size': data.newPriceFontSize,
            'new_price_font_color': data.newPriceFontColor,
            'old_price_font_family': data.oldPriceFontFamily,
            'old_price_font_style': data.oldPriceFontStyle,
            'old_price_font_size': data.oldPriceFontSize,
            'old_price_font_color': data.oldPriceFontColor,
            'cart_text': data.cartText,
            'product_text': data.productText,
            'show_product_qty': data.showProductQty,
            'active_PC': data.activePC,
            'active_mobile': data.activeMobile,
            'cart_font_family': data.cartFontFamily,
            'cart_font_style': data.cartFontStyle,
            'cart_font_color': data.cartFontColor,
            'back_ground_color': data.backgroundColor,
            'cart_font_size': data.cartFontSize,
        });
    },
    
    getSetup(){
        return superagent.post('/api/setting/get').send({
            'shopify_domain': domain,
        });
    },
    
    getProducts(pageNumber, isMainProduct = false){
        return superagent.post('/api/product/get-list').send({
            'shopify_domain': domain,
            'page_number': pageNumber,
            'is_main_product': isMainProduct
        });
    },

    searchProduct(keyWord, pageNumber, isMainProduct = false){
        return superagent.post('/api/product/search').send({
            'shopify_domain': domain,
            'key_word': keyWord,
            'page_number': pageNumber,
            'is_main_product': isMainProduct
        });
    },

    searchRule(keyWord, pageNumber){
        return superagent.post('/api/cart-rule/search').send({
            'shopify_domain': domain,
            'key_word': keyWord,
            'page_number': pageNumber
        });
    },

    cloneProducts(){
        return superagent.post('/api/product/clone').send({
            'shopify_domain': domain,
        });
    },
    
    getProductInfo(){
        return superagent.post('/api/product/get').send({
            'shopify_domain': domain,
        });
    },

    saveCartRule(data){
        return superagent.post('/api/cart-rule/save').send({
            'shopify_domain': domain,
            'name': data.ruleName,
            'products': data.discountProducts,
            'is_percentage': data.isPercentage,
            'reduction_percent': data.reductionPercent,
            'start_date': data.startDate,
            'end_date': data.endDate
        });
    },

    getRules(pageNumber){
        return superagent.post('/api/cart-rule/get-list').send({
            'shopify_domain': domain,
            'page_number': pageNumber,
        });
    },

    getDataDashBoard (range, summaryStartDate, startDate, endDate) {
        return superagent.post('/api/dashboard').send({
            'shopify_domain': domain,
            "granularity": range,
            "summary_start_date": summaryStartDate,
            "date_from":startDate,
            "date_to": endDate,
        });
    },

    deleteRule(idCartRules, idPriceRules){
        return superagent.post('/api/cart-rule/delete').send({
            'shopify_domain': domain,
            'id_cart_rules': idCartRules,
            'id_price_rule_shopify': idPriceRules,
        });
    },

    getCartRules(idProduct){
        return superagent.post('/api/cart-rule/get').send({
            'shopify_domain': domain,
            'id_product': idProduct,
        });
    },
    
    changeRuleStatus(idCartRules, status){
        return superagent.post('/api/cart-rule/change-status').send({
            'shopify_domain': domain,
            'id_cart_rules': idCartRules,
            'status': status,
        });
    },

    getCartRule (idCartRule) {
        return superagent.post('/api/cart-rule/get-detail').send({
            'id': idCartRule,
        });
    },

    updateCartRule (data) {
        return superagent.post('/api/cart-rule/update').send({
            'shopify_domain': domain,
            'products': data.discountProducts,
            'reduction_percent': data.reductionPercent,
            'id_cart_rule': data.idCartRule,
            'start_date': data.startDate,
            'end_date': data.endDate
        });
    }
}