export default async function HomeLocation() {
  return (
    <section className="flat-spacing-14 ">
      <div className="container">
        <div className="flat-location">
          <div className="banner-map">
            <iframe
              title="Store Location"
              src="https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sAnkh+Optics,+Karachi"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "450px", display: "block" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
