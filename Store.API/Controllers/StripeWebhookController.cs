using Microsoft.AspNetCore.Mvc;
using Store.Application.Interfaces;
using Store.Application.Settings;
using Stripe;

namespace Store.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StripeWebhookController : ControllerBase
    {
        private readonly StripeSettings _stripeSettings;
        private readonly IPaymentService _paymentService;

        public StripeWebhookController(
            StripeSettings stripeSettings,
            IPaymentService paymentService)
        {
            _stripeSettings = stripeSettings;
            _paymentService = paymentService;
        }

        [HttpPost]
        public async Task<IActionResult> HandleWebhook()
        {
            var json = await new StreamReader(
                HttpContext.Request.Body).ReadToEndAsync();

            var stripeSignature =
                Request.Headers["Stripe-Signature"];

            Stripe.Event stripeEvent;

            try
            {
                stripeEvent = EventUtility.ConstructEvent(
                    json,
                    stripeSignature,
                    _stripeSettings.WebhookSecret);
            }
            catch (StripeException ex)
            {
                Console.WriteLine(
                    $"Stripe Webhook Error: {ex.Message}");

                return BadRequest();
            }

            switch (stripeEvent.Type)
            {
                case EventTypes.PaymentIntentSucceeded:

                    var succeededIntent =
                        stripeEvent.Data.Object
                            as PaymentIntent;

                    if (succeededIntent != null)
                    {
                        await _paymentService
                            .UpdateOrderPaymentSucceededAsync(
                                succeededIntent.Id);
                    }

                    break;

                case EventTypes.PaymentIntentPaymentFailed:

                    var failedIntent =
                        stripeEvent.Data.Object
                            as PaymentIntent;

                    if (failedIntent != null)
                    {
                        await _paymentService
                            .UpdateOrderPaymentFailedAsync(
                                failedIntent.Id);
                    }

                    break;
            }

            return Ok();
        }
    }
}