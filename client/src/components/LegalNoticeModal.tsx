import { X } from "lucide-react";
import "../styles/LegalNoticeModal.css";

interface LegalNoticeProps {
  visible: boolean;
  onClose?: () => void;
}

export default function LegalNoticeModal({
  visible,
  onClose,
}: LegalNoticeProps) {
  if (!visible) return null;

  return (
    <div
      className="legal-notice-overlay"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClose?.();
        }
      }}
    >
      <div
        className="legal-notice-content"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <X className="legal-notice-close" onClick={onClose} />
        <div className="legal-notice-header">
          <h5 className="legal-notice-title">Mentions Légales</h5>
        </div>
        <div className="legal-notice-body">
          <h6 className="legal-notice-subtitle">1. Informations légales</h6>
          <p>
            Le site internet et l'application mobile Wildy Gamy sont édités par
            : <span id="legal-name">Wildy Gamy SAS </span>Société au capital
            social de 10 000 € Siège social : 8 Rue de Valenciennes, 31000
            Toulouse Téléphone : 05 55 55 55 55 Email : wildygamy.tlse@gmail.com
            SIRET : 123 456 789 00001 RCS Toulouse : B 123 456 789 N° TVA
            intracommunautaire : FR 12 123456789
            <br />
            Directeurs de la publication : Charlotte, Florentin, Abdou et
            Justine
          </p>
          <h6 className="legal-notice-subtitle">2. Hébergement</h6>
          <p>
            Le site internet et l'application sont hébergés par : CloudHosting
            Solutions SAS 42 avenue des Serveurs 75001 Paris - France SIRET :
            987 654 321 00002 RCS Paris : B 987 654 321 Tel : +33 (0)1 23 45 67
            89 Email : contact@cloudhostingsolutions.fr
          </p>
          <h6 className="legal-notice-subtitle">3. Propriété intellectuelle</h6>
          <p>
            L'ensemble du contenu du site et de l'application (textes, images,
            logos, etc.) est protégé par le droit d'auteur et est la propriété
            exclusive de Wildy Gamy SAS. Toute reproduction, représentation,
            modification, publication, adaptation ou exploitation de tout ou
            partie des éléments du site est interdite sans l'autorisation écrite
            préalable de Wildy Gamy SAS.
          </p>
          <h6 className="legal-notice-subtitle">
            4. Protection des données personnelles
          </h6>
          <p>
            Conformément au Règlement Général sur la Protection des Données
            (RGPD) et à la loi Informatique et Libertés, vous disposez d'un
            droit d'accès, de rectification, de suppression et d'opposition aux
            données personnelles vous concernant. Pour exercer ces droits ou
            pour toute question relative à vos données personnelles, vous pouvez
            contacter notre Délégué à la Protection des Données (DPO) :
            FLORENTIN Par email : wildygamy.tlse@gmail.com Par courrier : Wildy
            Gamy SAS - DPO, 8 Rue de Valenciennes, 31000 Toulouse
          </p>
          <h6 className="legal-notice-subtitle">5. Cookies</h6>
          <p>
            Notre site utilise des cookies pour améliorer votre expérience de
            navigation. Vous pouvez paramétrer vos préférences concernant les
            cookies dans les paramètres de votre navigateur.
          </p>
          <h6 className="legal-notice-subtitle">
            6. Conditions générales d'utilisation
          </h6>
          <p>
            L'utilisation du site et de l'application implique l'acceptation
            pleine et entière des conditions générales d'utilisation décrites
            ci-après. Ces conditions d'utilisation sont susceptibles d'être
            modifiées ou complétées à tout moment.
          </p>
          <h6 className="legal-notice-subtitle">
            7. Limitation de responsabilité
          </h6>
          <p>
            Wildy Gamy SAS met tout en œuvre pour offrir aux utilisateurs des
            informations et outils disponibles et vérifiés, mais ne saurait être
            tenue responsable des erreurs, d'une absence de disponibilité des
            informations, ou de la présence de virus sur son site.
          </p>
          <h6 className="legal-notice-subtitle">
            8. Loi applicable et juridiction
          </h6>
          <p>
            Les présentes mentions légales sont soumises au droit français. En
            cas de litige, les tribunaux français seront seuls compétents.
          </p>
          <h6 className="legal-notice-subtitle">9. Contact</h6>
          <p>
            Pour toute question concernant ces mentions légales, vous pouvez
            nous contacter :
            <br /> Par téléphone : 05 55 55 55 55
            <br />
            Par email : wildygamy.tlse@gmail.com
            <br />
            Par courrier : 8 Rue de Valenciennes, 31000 Toulouse
            <br />
            <br />
            Dernière mise à jour : 09/02/2025
          </p>
        </div>
      </div>
    </div>
  );
}
