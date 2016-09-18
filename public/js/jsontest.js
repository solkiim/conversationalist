$.ajax({
    type: "POST",
    url: "/sound",
    data: { mydata: JSON.stringify(totalChanges) },
    success: function(response, textStatus, jqXHR) {
        console.log("Yay it worked.", response);
    }
);