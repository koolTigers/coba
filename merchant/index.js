// Orders

var orders_body = [
    {template: "Tiene los siguientes pedidos por realizar:"},
    {template: "Lista de Pedidos"},
];

var __shop_orders = [];
var __triggerOrder = false;

function triggerOrder() {
    if (!__triggerOrder) {
        setTimeout(function () {
            order_received();
        },1000);
        __triggerOrder = true;
    }

}

function InitOrders() {
    getOrdersByShop("Abarrotes San Juan (168m)", function(val){
        __shop_orders.push(val);
        triggerOrder();
    });
}

function orderShowBadges() {
    // Modify badges
    $$("main_menu_button").define({
        badge: __shop_orders.length
    });
    $$("main_menu_button").refresh();
    $$("main_menu_list").updateItem(2, {
        id: 2,
        value: "Pedidos a Domicilio",
        icon: "home",
        count: __shop_orders.length
    });
}

function order_received() {
    orderShowBadges();
    webix.modalbox({
        title: "Pedido a domicilio recibido",
        buttons:["Si", "No"],
        text: "&iquest;Ir a ver los pedidos ahora?",
        width: 400,
        callback: function(result){
            switch(result){
            case 0: 
                //statement
                break;
            case 1:
                //statement
                break;
            }
        }
    });

}

// Inventory

inventory_body = [
    {
        id: "inventory_table",
        view:"datatable", 
        columns:[
            { id:"barcode", header:"Codigo de barras", width:150},
            { id:"name", header:"Nombre del producto", width:400},
            { id:"description", header:"Descripcion", width:400},
        ],
        on: {
            onAfterRender: function () {
                getProductsByShop("Abarrotes San Juan (168m)", function(val){
                    $$("inventory_table").parse(val);
                });
            }
        }
    }
];

// Sells

var __search_barcode = "";

function search_barcode(barcode) {
    var id, item, total;
    for(id = $$("products_list").getFirstId();
        id != null; id = $$("products_list").getNextId(id)) {
        item = $$("products_list").getItem(id);
        if(item.barcode == barcode) {
            total = $$("sell_total").getValues();
            item.quantity++;
            total.quantity++;
            total.total += item.price;
            $$("products_list").remove(id);
            $$("products_list").add(item);
            $$("sell_total").setValues(total);
            return;
        }
    }
    getProductByCodeAndShop(barcode, "Abarrotes San Juan (168m)", function(val){
        var total;
        total = $$("sell_total").getValues();
        val.quantity = 1;
        total.quantity++;
        total.total += val.price;
        $$("products_list").add(val);
        $$("sell_total").setValues(total);
    });
}

function keyPress_barcode(code, event) {
    if(code >= 48 && code <= 58) {
        __search_barcode += String.fromCharCode(code);
    } else if(__search_barcode.length > 0) {
        $$("search_text").setValue("");
        search_barcode(__search_barcode);
        __search_barcode = "";
    }
}

function aToPrice(price) {
    return price = Number(price).toFixed(2);
}

ventas_body = [
    {
        view: "form",
        elements: [
            {
                cols: [
                    {
                        id: "search_text",
                        view: "text",
                        borderless: true,
                        placeholder: "Comienza a buscar un producto...",
                        on: {
                            onKeyPress: keyPress_barcode,
                            onAfterRender: function() {
                                this.focus();
                            }
                        }
                    },
                    {view: "icon", icon: "search"}
                ]
            }
        ]
    },
    {
        id: "products_list",
        view: "list",
        template: function(data) {
            var tmp = "<table class=\"prod_list\"><tr>" +
                "<td><img src=\"" + data.photo + "\"></td>" +
                "<td>" + data.description + "</td>" +
                "<td>" + data.quantity + " x $ " + aToPrice(data.price) + " = </td>" +
                "<td>$</td>" +
                "<td>" + aToPrice(data.quantity * data.price) + "</td>" +
                "</tr></table>";
            return tmp;
        },
        select: true,
        data: [

        ],
        type: {
            height: 60
        }, 
    },
    {
        id: "sell_total",
        view: "template",
        height: 80,
        template: function (data) {
            return "<table class=\"sell_total\"><tr>" +
                "<td>" + data.quantity + " Productos</td>" +
                "<td>Total:&nbsp;&nbsp;$</td>" +
                "<td>" + aToPrice(data.total) + "</td>" +
                "</tr></table>";
        },
        data: {quantity: 0, total: 0}
    }
];

// MAIN Layout

main_smenu = {
    view: "sidemenu",
    id: "main_smenu",
    width: 220,
    position: "left",
    state: function(state){
        var toolbarHeight = $$("main_header").$height;
        state.top = toolbarHeight;
        state.height -= toolbarHeight;
    },
    css: "coba_menu",
    body:{
        id: "main_menu_list",
        view: "list",
        borderless: true,
        scroll: false,
        template: function(data) {
            var ret =  "<span class='webix_icon fa-" +
            data.icon + "'></span>&nbsp;&nbsp;" + data.value;
            if(data.count > 0) {
                ret += "<span class=\"webix_badge\">" + data.count + "</span>";
            }
            return ret;
        },
        data: [
            {id: 1, value: "Venta", icon: "usd"},
            {id: 2, value: "Pedidos a Domicilio", icon: "home"},
            {id: 3, value: "Inventario", icon: "cubes"},
            {id: 4, value: "Reportes", icon: "line-chart"},
            {id: 5, value: "Usuarios", icon: "users"},
            {id: 6, value: "Administracion", icon: "cog"},
        ],
        select: true,
        type: {
            height: 50
        },
        on: {
            "onItemClick":function(id, e, trg){ 
                var bodyContent = [];
                switch (id) {
                    case "1":
                    bodyContent = ventas_body;
                    break;
                    case "2":
                    bodyContent = orders_body;
                    break;
                    case "3":
                    bodyContent = inventory_body;
                }
                $$("main_body").define({
                    rows: bodyContent
                });
                $$("main_body").reconstruct();
                $$("main_title").define({
                    label: "<span class='title_nobadge'>" + trg.innerHTML + "</span>"
                });
                $$("main_title").refresh();
                setTimeout(function () {
                    if( $$("main_smenu").config.hidden){
                        $$("main_smenu").show();
                    }
                    else {
                        $$("main_smenu").hide();
                    }
                },500);
            }
        }
    }
};

main_body = {
    id: "main_body",
    view: "layout",
    type: "space",
    rows: [{}]
};

main_header = {
    id: "main_header",
    view: "toolbar",
    elements: [
    {
        id: "main_menu_button",
        view: "icon",
        icon: "bars",
        click: function(){
            if( $$("main_smenu").config.hidden){
                $$("main_smenu").show();
            }
            else {
                $$("main_smenu").hide();
            }
        }
    },
    {id: "main_title", view: "label", label: "<span class='webix_icon fa-usd'></span>&nbsp;Venta", width: 250},
    {},
    {view: "label", label: "LOCALITO"},
    {},
    {view: "button", type:"icon", icon: "user", maxWidth: 100, align: "right", label: "&nbsp;&nbsp;Mi Cuenta"}
    ]
};


main_layout = {
    id: "main_layout",
    view: "layout",
    rows: [
    main_header,
    main_body
    ]
};

webix.ready(function(){
    webix.ui(main_layout);
    webix.ui(main_smenu);
    $$("main_body").define({
        rows: ventas_body
    });
    $$("main_body").reconstruct();

    InitOrders();
});
