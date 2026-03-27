import React from "react";

export const metadata = {
  title: "Refund Policy | Ankhoptics",
};

export default function RefundPolicyPage() {
  return (
    <>
      {/* page-title */}
      <div className="tf-page-title style-2">
        <div className="container-full">
          <div className="heading text-center">Refund policy</div>
        </div>
      </div>
      {/* /page-title */}
      {/* main-page */}
      <section className="flat-spacing-25">
        <div className="container">
          <div className="tf-main-area-page tf-page-delivery">
            <div
              className="policy-content space-y-5 text-justify"
              style={{ color: "var(--text, #444)", lineHeight: 1.6 }}
            >
              <div className="mb-10">
                <h5 className="text-2xl font-bold mt-8 mb-6">Returns</h5>
                <p className="mb-4">
                  We have a 7-day return policy, which means you have 7 days
                  after receiving your item to request a return.
                </p>
                <p>
                  To be eligible for a return, your item must be in the same
                  condition that you received it, unworn or unused, with tags,
                  and in its original packaging. You’ll also need the receipt or
                  proof of purchase.
                </p>
                <p>
                  To start a return, you can contact us at{" "}
                  <a href="mailto:info@ankhoptic.com" className="underline">
                    info@ankhoptic.com
                  </a>
                  . If your return is accepted, we’ll send you a return shipping
                  label, as well as instructions on how and where to send your
                  package. Items sent back to us without first requesting a
                  return will not be accepted.
                </p>
                <p className="mb-5">
                  You can always contact us for any return question at{" "}
                  <a href="mailto:info@ankhoptic.com" className="underline">
                    info@ankhoptic.com
                  </a>
                  .
                </p>
              </div>

              <div className="mb-10">
                <h5 className="text-2xl font-bold  mb-6">Damages and issues</h5>
                <p className="mb-5">
                  Please inspect your order upon reception and contact us
                  immediately if the item is defective, damaged or if you
                  receive the wrong item, so that we can evaluate the issue and
                  make it right.
                </p>
              </div>

              <div className="mb-10">
                <h5 className="text-2xl font-bold mt-8 mb-6">
                  Exceptions / non-returnable items
                </h5>
                <p className="mb-3">
                  Certain types of items cannot be returned, like perishable
                  goods (such as food, flowers, or plants), custom products
                  (such as special orders or personalized items), and personal
                  care goods (such as beauty products). We also do not accept
                  returns for hazardous materials, flammable liquids, or gases.
                  Please get in touch if you have questions or concerns about
                  your specific item.
                </p>

                <p className="mb-5">
                  Unfortunately, we cannot accept returns on sale items or gift
                  cards.
                </p>
              </div>

              <div className="mb-10">
                <h5 className="text-2xl font-bold mt-8 mb-6">Exchanges</h5>
                <p className="mb-5">
                  The fastest way to ensure you get what you want is to return
                  the item you have, and once the return is accepted, make a
                  separate purchase for the new item.
                </p>
              </div>

              <div className="mb-10">
                <h5 className="text-2xl font-bold mt-8 mb-6">
                  European Union 14 day cooling off period
                </h5>
                <p className="mb-5">
                  Notwithstanding the above, if the merchandise is being shipped
                  into the European Union, you have the right to cancel or
                  return your order within 14 days, for any reason and without a
                  justification. As above, your item must be in the same
                  condition that you received it, unworn or unused, with tags,
                  and in its original packaging. You’ll also need the receipt or
                  proof of purchase.
                </p>
              </div>

              <div className="mb-10">
                <h5 className="text-2xl font-bold mt-8 mb-6">Refunds</h5>
                <p className="mb-4">
                  We will notify you once we’ve received and inspected your
                  return, and let you know if the refund was approved or not. If
                  approved, you’ll be automatically refunded on your original
                  payment method within 10 business days. Please remember it can
                  take some time for your bank or credit card company to process
                  and post the refund too.
                </p>
                <p>
                  If more than 15 business days have passed since we’ve approved
                  your return, please contact us at{" "}
                  <a href="mailto:info@ankhoptic.com" className="underline">
                    info@ankhoptic.com
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* /main-page */}
    </>
  );
}
