export default function InfoOrari() {
  return (
    <section className="section" id="orari">
      <div className="container" style={{ maxWidth: '600px' }}>
        <span className="section__label">Quando trovarci</span>
        <h2 className="section__h2">I nostri orari</h2>
        <table className="orari__table" aria-label="Orari di apertura">
          <tbody>
            <tr><td>Lunedì</td>    <td className="closed">Chiuso</td></tr>
            <tr><td>Martedì</td>   <td className="open">09 – 19</td></tr>
            <tr><td>Mercoledì</td> <td className="open">09 – 19</td></tr>
            <tr><td>Giovedì</td>   <td className="open">09 – 19</td></tr>
            <tr><td>Venerdì</td>   <td className="open">09 – 19</td></tr>
            <tr><td>Sabato</td>    <td className="open">09 – 19</td></tr>
            <tr><td>Domenica</td>  <td className="closed">Chiuso</td></tr>
          </tbody>
        </table>
        <div style={{ marginTop: '28px' }}>
          <a href="tel:+3902537982" className="btn-grey">Chiama ora</a>
        </div>
      </div>
    </section>
  )
}
