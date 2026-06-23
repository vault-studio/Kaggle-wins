import './Figure.css'

export default function Figure({ caption, children }) {
  return (
    <figure className="figure">
      <div className="figure-body">{children}</div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}
