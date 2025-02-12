import { X } from "lucide-react";
import "../styles/ConfidentialityPolicyModal.css";

interface LegalNoticeProps {
  visible: boolean;
  onClose?: () => void;
}

export default function ConfidentialityPilocyModal({
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
        className="confidentiality-content"
        onClick={(e) => e.stopPropagation()}
        onKeyUp={(e) => e.stopPropagation()}
      >
        <X className="confidentiality-close" onClick={onClose} />
        <div className="confidentiality-header">
          <h5 className="confidentiality-title">
            Politique de Confidentialité - Wildy Gamy
          </h5>
        </div>
        <div className="confidentiality-body">
          <p>Dernière mise à jour : 09/02/2025</p>
          <h6 className="confidentiality-subtitle">1. Introduction</h6>
          <p>
            Wildy Gamy SAS s'engage à protéger votre vie privée. Cette politique
            de confidentialité explique comment nous collectons, utilisons,
            partageons et protégeons vos données personnelles lorsque vous
            utilisez notre application et notre site web.
          </p>
          <h6 className="confidentiality-subtitle">2. Données collectées</h6>
          <p>
            <span className="confidentiality-span">
              2.1 Données que vous nous fournissez directement{" "}
            </span>
            <br />
            <ul>
              <li className="confidentiality-list">
                Informations de compte : nom, prénom, adresse email, nom
                d'utilisateur
              </li>
              <li className="confidentiality-list">
                Informations de profil : photo de profil, date de naissance,
                préférences de jeu
              </li>
              <li className="confidentiality-list">
                Communications : messages envoyés au support client
              </li>
            </ul>
            <br />
            <br />
            <span className="confidentiality-span">
              2.2 Données collectées automatiquement
            </span>
            <br />
            <ul>
              <li className="confidentiality-list">
                Données de jeu : scores, niveaux atteints
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">
            3. Utilisation des données
          </h6>
          <p>
            Nous utilisons vos données personnelles pour :
            <br />
            <ul>
              <li className="confidentiality-list">
                Fournir et améliorer nos services
              </li>
              <li className="confidentiality-list">
                Personnaliser votre expérience de jeu
              </li>
              <li className="confidentiality-list">
                Gérer votre compte et assurer la sécurité
              </li>
              <li className="confidentiality-list">
                Communiquer avec vous concernant nos services
              </li>
              <li className="confidentiality-list">
                Respecter nos obligations légales
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">
            4. Base légale du traitement
          </h6>
          <p>
            Nous traitons vos données sur les bases légales suivantes :
            <br />
            <ul>
              <li className="confidentiality-list">
                L'exécution du contrat lorsque vous utilisez nos services
              </li>
              <li className="confidentiality-list">
                Votre consentement pour certains traitements spécifiques
              </li>
              <li className="confidentiality-list">
                Nos intérêts légitimes (amélioration des services, sécurité)
              </li>
              <li className="confidentiality-list">Nos obligations légales</li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">5. Partage des données</h6>
          <p>
            Nous pouvons partager vos données avec :
            <br />
            <span className="confidentiality-span">5.1 Nos sous-traitants</span>
            <ul>
              <li className="confidentiality-list">
                Services d'hébergement : CloudHosting Solutions SAS
              </li>
            </ul>
            <span className="confidentiality-span">
              <br />
              5.2 Autres destinataires
            </span>
            <ul>
              <li className="confidentiality-list">
                Partenaires de jeu (avec votre consentement)
              </li>
              <li className="confidentiality-list">
                Autorités compétentes (sur demande légale)
              </li>
              <li className="confidentiality-list">
                Acquéreurs potentiels en cas de vente de l'entreprise
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">
            6. Protection des données
          </h6>
          <p>
            Nous mettons en œuvre des mesures de sécurité appropriées :
            <br />
            <ul>
              <li className="confidentiality-list">
                Chiffrement des données sensibles
              </li>
              <li className="confidentiality-list">
                Surveillance continue des systèmes
              </li>
              <li className="confidentiality-list">
                Formation régulière de notre personnel
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">
            7. Conservation des données
          </h6>
          <p>
            Nous conservons vos données :
            <br />
            <ul>
              <li className="confidentiality-list">
                Données de compte : pendant la durée de votre inscription
              </li>
              <li className="confidentiality-list">
                Données de jeu : 3 ans après votre dernière activité{" "}
              </li>

              <li className="confidentiality-list">
                Données de support : 2 ans après la dernière interactione.
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">8. Vos droits</h6>
          <p>
            Conformément au RGPD, vous disposez des droits suivants :
            <br />
            <ul>
              <li className="confidentiality-list">
                Droit d'accès à vos données{" "}
              </li>
              <li className="confidentiality-list">Droit de rectification</li>
              <li className="confidentiality-list">
                Droit à l'effacement ("droit à l'oubli")
              </li>
              <li className="confidentiality-list">
                Droit à la limitation du traitement
              </li>
              <li className="confidentiality-list">
                Droit à la portabilité des données{" "}
              </li>
              <li className="confidentiality-list">Droit d'opposition</li>
              <li className="confidentiality-list">
                {" "}
                Droit de retirer votre consentement
              </li>
            </ul>
            <br />
            Pour exercer ces droits, contactez notre DPO :
            <ul>
              <li className="confidentiality-list">
                Email : wildygamy.tlse@wildygamy.com{" "}
              </li>
              <li className="confidentiality-list">
                Adresse : 8 Rue de Valenciennes, 31000 Toulouse
              </li>
            </ul>
          </p>
          <h6 className="confidentiality-subtitle">
            9. Transferts internationaux
          </h6>
          <p>
            Vos données sont principalement traitées dans l'Union Européenne. Si
            nous devons transférer vos données hors UE, nous nous assurons que
            des garanties appropriées sont en place (clauses contractuelles
            types, décision d'adéquation).
          </p>
          <h6 className="confidentiality-subtitle">
            10. Cookies et technologies similaires
          </h6>
          <p>
            Nous utilisons différents types de cookies :
            <br />
            <ul>
              <li className="confidentiality-list">
                Cookies essentiels : nécessaires au fonctionnement du site
              </li>
            </ul>
            <br />
            Vous pouvez gérer vos préférences de cookies via notre bandeau de
            cookies ou les paramètres de votre navigateur.
          </p>
          <h6 className="confidentiality-subtitle">
            11. Protection des mineurs
          </h6>
          <p>
            Notre service est destiné aux utilisateurs de plus de 13 ans. Nous
            ne collectons pas sciemment des données concernant les enfants de
            moins de 13 ans sans le consentement parental.
          </p>
          <h6 className="confidentiality-subtitle">
            12. Modifications de la politique
          </h6>
          <p>
            Nous nous réservons le droit de modifier cette politique. Les
            modifications entrent en vigueur dès leur publication. Nous vous
            informerons des changements importants par email ou notification
            dans l'application.
          </p>
          <h6 className="confidentiality-subtitle">13. Contact</h6>
          <p>
            Pour toute question concernant cette politique :
            <br />
            Email : wildygamy.tlse@gmail.com
            <br />
            Téléphone : 05 55 55 55 55
            <br />
            Adresse : 8 Rue de Valenciennes, 31000 Toulouse
            <br />
            <br />
            Vous pouvez également contacter l'autorité de protection des données
            (CNIL) : www.cnil.fr
          </p>
        </div>
      </div>
    </div>
  );
}
