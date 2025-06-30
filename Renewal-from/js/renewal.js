$(document).ready(function () {
    renewalReceiptFormCls();
});
// DNC Registry call
function renewalReceiptFormCls() {
    $(document).on('click', '.renewalReceiptForm', function (e) {
        e.preventDefault();
        var thisDiv = $(this);
        $(this).parents('.static-form-container').find('.form-user-grp input, .form-user-grp select').trigger('blur');
        var errorDiv = $('.error');
        setTimeout(function () {
            if (!errorDiv.length) {
                $(thisDiv).addClass('hide');
                $(thisDiv).next().addClass('show');

                var queryParams = {};

                queryParams['policyNumber'] = $('.renewalReceiptFormCls input[name="policyNumber"]').val();
                queryParams['policyHolderDob'] = $('.renewalReceiptFormCls input[name="datepicker"]').val();
                queryParams['mobileNumber'] = $('.renewalReceiptFormCls input[name="mobileNumber"]').val();
                if (thisDiv.attr('id') == "otpNumber") {
                    queryParams['otpNumber'] = $('.otpModal .otp-wrap input[id="otpNumber"]').val();
                }

                $.ajax({
                    type: 'POST',
                    url: '/bin/renewalReceiptForm',
                    data: queryParams,
                    cache: false,
                    success: function (data) {
                        console.log(data);
                        $(thisDiv).removeClass('hide');
                        $(thisDiv).next().removeClass('show');
                        $('.otpModal').addClass('is-visible');
                        $('.renewalReceiptFormPopup').addClass('is-visible');
                        try {
                            data = htmlDecode(data);
                            data = JSON.parse(data);
                            downloadPDF(data.receiptData);
                        } catch (err) {
                            $('.otpModal').removeClass('is-visible');
                            console.log(err);
                            $(thisDiv).removeClass('hide');
                            $(thisDiv).next().removeClass('show');
                            $(".ErrorData h2").text('Something went wrong, please try again later.');
                            $('.ErrorData').addClass('is-visible');
                        }
                        //console.log("Renewal Receipt Form successfully");
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        $('.otpModal').removeClass('is-visible');
                        $(thisDiv).removeClass('hide');
                        $(thisDiv).next().removeClass('show');
                        $(".ErrorData h2").text('No Data Found');

                        $('.ErrorData').addClass('is-visible');
                        //console.log('Renewal Receipt Form: ' + textStatus);
                    },

                });





            }
        }, 200);
    });
}

function downloadPDF(pdf) {
    const linkSource = `data:application/pdf;base64,${pdf}`;
    const downloadLink = document.createElement("a");
    const fileName = "Renewal Receipt for " + $('.renewalReceiptFormCls input[name="policyNumber"]').val() + ".pdf";

    downloadLink.href = linkSource;
    downloadLink.download = fileName;
    downloadLink.click();
}

function htmlDecode(input) {
    var e = document.createElement('textarea');
    e.innerHTML = input;
    // handle case of empty input
    var elementLength = e.childNodes.length;
    if (elementLength === 0) {
        return "";
    } else if (elementLength === 1) {
        return e.childNodes[0].nodeValue;
    } else if (elementLength > 1) {
        var cleanText = '';
        for (var i = 0; i < elementLength; i++) {
            cleanText = cleanText + e.childNodes[i].nodeValue;
        }
        return cleanText;
    }
}

