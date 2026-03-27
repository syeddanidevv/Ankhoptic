export default function IconBox() {
  const items = [
    { icon: "icon-car-order",     title: "Free Shipping",  desc: "Free delivery above Rs 2500" },
    { icon: "icon-heart",         title: "Satisfaction",   desc: "Satisfaction with every order" },
    { icon: "icon-suport",        title: "Support",        desc: "24/7 support for all your needs" },
    { icon: "icon-return-order",  title: "Return",         desc: "Easy returns within 7 days" },
  ];

  return (
    <section className="flat-spacing-1 has-line-bottom flat-iconbox">
      <style>{`
        .iconbox-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 24px 32px;
        }
        .iconbox-item {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .iconbox-item .icon { font-size: 32px; color: var(--main, #020042); flex-shrink: 0; }
        .iconbox-item .title { font-weight: 600; font-size: 14px; margin-bottom: 2px; }
        .iconbox-item p { font-size: 13px; color: #666; margin: 0; }
        @media (max-width: 991px) {
          .iconbox-grid { grid-template-columns: 1fr 1fr; gap: 20px 32px; }
          .iconbox-item { justify-content: center; }
        }
        @media (max-width: 575px) {
          .iconbox-grid { grid-template-columns: 1fr; gap: 18px; padding: 0 8px; }
          .iconbox-item { justify-content: flex-start; margin: 0 auto; width: max-content; }
        }
      `}</style>
      <div className="container">
        <div className="iconbox-grid">
          {items.map((item) => (
            <div className="iconbox-item" key={item.title}>
              <div className="icon"><i className={item.icon} /></div>
              <div className="content">
                <div className="title fw-4">{item.title}</div>
                <p>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
