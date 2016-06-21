/*
{id: 1, cant: 1, sku: "7501055300341", product: "Sprite lata 355ml", price: 10, image: "https://dworkins.com/media/catalog/product/cache/1/image/800x800/9df78eab33525d08d6e5fb8d27136e95/s/p/sprite_355_1_1_1_1_2_1_1_1_1.jpg"},
{id: 2, cant: 2, sku: "7501031323302", product: "7up lima-limon lata 355ml", price: 9.5, image: "https://www.lacomer.com.mx/superc/img_art/7501031323302_1.jpg"},
{id: 3, cant: 1, sku: "7501086801015", product: "Epura 1.5L", price: 12.34, image: "http://farmaciasdrdi.com/wp-content/uploads/2016/03/AGUA-EPURA-1-5-LITROS.jpg"}
*/

var __search_barcode = "";

function search_barcode(barcode) {
    getProductByCodeAndShop(barcode, "Abarrotes San Juan (168m)", function(val){
        webix.message(val);
    })
}

function keyPress_barcode(code, event) {
    if(code >= 48 && code <= 58) {
        __search_barcode += String.fromCharCode(code);
    } else if(__search_barcode.length > 0) {
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
                "<td><img src=\"" + data.image + "\"></td>" +
                "<td>" + data.product + "</td>" +
                "<td>" + data.cant + " x $ " + aToPrice(data.price) + " = </td>" +
                "<td>$</td>" +
                "<td>" + aToPrice(data.cant * data.price) + "</td>" +
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
        view: "form",
        elements: [
            {
                cols: [
                    {},
                    {view: "label", label: "Total"}
                ]
            }
        ]
    }
];
pedidos_body = [];

// MAIN Layout

main_smenu = {
    view: "sidemenu",
    id: "main_smenu",
    width: 200,
    position: "left",
    state: function(state){
        var toolbarHeight = $$("main_header").$height;
        state.top = toolbarHeight;
        state.height -= toolbarHeight;
    },
    css: "coba_menu",
    body:{
        view: "list",
        borderless: true,
        scroll: false,
        template: "<span class='webix_icon fa-#icon#'></span>&nbsp;&nbsp;#value#",
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
                        bodyContent = pedidos_body;
                        break;
                }
                $$("main_body").define({
                    rows: bodyContent
                });
                $$("main_body").reconstruct();
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
            view: "icon", icon: "bars",
            click: function(){
                if( $$("main_smenu").config.hidden){
                    $$("main_smenu").show();
                }
                else {
                    $$("main_smenu").hide();
                }
            }
        },
        {id: "main_title", view: "label", label: "<span class='webix_icon fa-usd'></span>&nbsp;Venta"},
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
});
