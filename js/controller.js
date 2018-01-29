function grabarSolicitud($scopeSession, form) {
    var $j = jQuery,
        $myModal = $j("#myMsgModal"),
        solicitudObj = new Object();

    $form = $j(form);
    $myModal.find(".modal-title").html("");
    $myModal.find(".modal-body").html("");

    solicitudObj.nombre = $form.find("input#nombre.form-control").val();
    solicitudObj.email = $form.find("input#email.form-control").val();
    solicitudObj.fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');
    solicitudObj.estatus = "vigente";
    
    if($form.find("#tel_cellular").length || 0 > 0) {
        solicitudObj.tel_cellular = $form.find("#tel_cellular").val();
        solicitudObj.num_invitados = $form.find("#num_invitados").val();
        solicitudObj.comentarios = ["Presupuesto Platillo: ",
            $form.find("#platillo_nombre ").val(), " Precio: ",
            $form.find("#platillo_precio").val()].join("|");
    } else {
        solicitudObj.comentarios = $form.find("textarea#comentarios.form-control").val();
    }
    
    $j.post("solicitud_serv",
        solicitudObj,
        function (data, status) {
            var $myModal = $j("#myMsgModal"),
                msg;

            if(/success/.test(status.toLowerCase())) {
                $j(["input#nombre.form-control","input#email.form-control",
                    "textarea#comentarios.form-control",
                    "input#tel_cellular.form-control",
                    "input#num_invitados.form-control",
                    "input#platillo_nombre.form-control",
                    "input#platillo_precio.form-control"
                ].join(",")).val("");
                $myModal.find(".modal-title").html("Solicitud enviada con exito!"); 
            } else {
                $myModal.find(".modal-title").html(status);
            }
            
            var $myMenusModal = $j("#myModal");
            if($myMenusModal.length || 0 > 0) {
                $myMenusModal.modal("hide");
            }
            
            $myModal.find(".modal-body").html(data);
            $myModal.modal("show");
            
        }.bind($scopeSession));
        
        return false;
}
function validarSolicitud($scopeSession) {
    var $j = jQuery,
        $form = $j(["#", $scopeSession].join(""));
                
    if( $form.valid() ){
      grabarSolicitud( this, $form);
    } else {
      //clear errors
    }
    
    return false;
}
function precioPorPersona(args) {
    var $j = jQuery,
        $form = $j("#solicitud-reservacion-form"),
        
        //$alimentosPanel = $j(args[0]), // alimentosPanel
        mensaje = args[0] || "",       // mensaje descriptivo
        msgPPrecio = args[1] || 0,     // platillo precio 
        msgPNombre = args[2] || "Tradicional"; // platillo nombre

    $j("#precioxpersona", $form).html(mensaje);
    $j("#platillo_nombre", $form).val(msgPNombre);
    $j("#platillo_precio", $form).val(msgPPrecio);
    
    $j("button#solitarPresupuestoButton").click(
            validarSolicitud.bind(this, ["solicitud-reservacion-form"]));
}
(function($) {
    $('document').ready(function () {
        $("#solicitud-save-button").click(validarSolicitud.bind($("#contactoPanel"), "solicitud-form"));
        $("#solitarPresupuestoButton").click(validarSolicitud.bind(this, "solicitud-reservacion-form"));

        $("#gourmet-button").click(precioPorPersona.bind(this,
            ["Gourmet, $145.00 MX pesos por persona", "$145.00 MX", "Gourmet"]));
        $("#buffete-button").click(precioPorPersona.bind(this, 
            ["Buffete, $225.00 MX pesos por persona", "$220.00 MX", "Buffete"]));
        $("#platillos-button").click(precioPorPersona.bind(this, 
            ["Tradicional, $285.00 MX pesos por persona", "$285.00 MX", "Tradicional"]));
    });
}.bind(this)(jQuery));