const PageTitle = ({ title }) => {
  return (
    <section className="page-title py-5 py-1">
      <div className="container">
        <div className="row">
          <div className="col">
            <h1 className="title text-uppercase">{title}</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PageTitle;
