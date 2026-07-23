import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

export default function WelcomePage() {
  return (
    <section className="welcome-hero">
      <div className="welcome-hero-text">
        <span className="welcome-tag">Made for Montreal students</span>
        <h1>Buy and sell with students across Montreal</h1>
        <p className="welcome-subtitle">
          A marketplace for McGill, Concordia, Université de Montréal, UQAM, and every other campus in the
          city. Textbooks between semesters, furniture for move-in, tickets, tech, and more — all from
          people nearby.
        </p>
        <div className="welcome-actions">
          <Link to="/register" className="link-button welcome-cta">Create an account</Link>
          <Link to="/login" className="welcome-login-link">Already have one? Log in</Link>
        </div>
      </div>
      <img src={heroImage} alt="" className="welcome-hero-image" />
    </section>
  )
}
