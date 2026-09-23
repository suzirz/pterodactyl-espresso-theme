$(function() {
    function pingNodes() {
        $('span[data-action="ping"]').each(function(i, element) {
            var $el = $(element);
            var loc = $el.data('location');
            var secret = $el.data('secret');

            if (!loc || !secret) {
                $el.css({
                    'background': 'rgba(201, 75, 75, 0.15)',
                    'color': '#f87171',
                    'border': '1px solid rgba(201, 75, 75, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block'
                }).html('<i class="fa fa-circle-o" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Unreachable');
                return;
            }

            $.ajax({
                type: 'GET',
                url: loc,
                headers: {
                    'Authorization': 'Bearer ' + secret
                },
                timeout: 5000
            }).done(function(data) {
                var ver = data && data.version ? data.version : '';
                $el.css({
                    'background': 'rgba(82, 183, 136, 0.15)',
                    'color': '#52b788',
                    'border': '1px solid rgba(82, 183, 136, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block'
                }).html('<i class="fa fa-circle" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Online' + (ver ? ' <span style="opacity: 0.75; font-size: 10px;">(' + ver + ')</span>' : ''));
            }).fail(function(err) {
                var reason = 'Connection timeout or certificate error';
                try {
                    if (err.responseJSON && err.responseJSON.errors) {
                        reason = err.responseJSON.errors[0].detail;
                    }
                } catch(e) {}

                $el.css({
                    'background': 'rgba(201, 75, 75, 0.15)',
                    'color': '#f87171',
                    'border': '1px solid rgba(201, 75, 75, 0.35)',
                    'font-size': '11px',
                    'padding': '4px 8px',
                    'border-radius': '6px',
                    'display': 'inline-block',
                    'cursor': 'pointer'
                }).attr('title', reason).html('<i class="fa fa-circle-o" style="font-size: 7px; vertical-align: middle; margin-right: 4px;"></i> Offline');
            });
        });
    }

    pingNodes();
    setInterval(pingNodes, 30000);
});
