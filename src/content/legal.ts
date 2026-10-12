/* ────────────────────────────────────────────────────────────────
   Textes légaux du restaurant.

   CGU : reprise à l'identique de celle fournie par le client. Ne rien
   reformuler ici : c'est un document opposable. Toute modification
   doit venir du restaurant, ou de son conseil.

   MENTIONS / RGPD : structure conforme, mais ce site est encore une
   maquette de proposition, pas le site en ligne. Les champs propres
   au prestataire technique (créateur, hébergeur, crédits photo) ont
   donc été neutralisés plutôt que d'attribuer ce projet à l'agence et
   à l'hébergeur du site actuel — et un bandeau `intro` rappelle que
   ces deux pages sont à valider avec le restaurant avant mise en
   ligne. Les informations propres au restaurant lui-même (identité,
   adresse, contact, RCS) restent celles fournies par le client.

   Ces textes restent en français dans les deux versions du site.
   Traduire un document juridique en changerait la portée, et la
   version française fait foi.
   ──────────────────────────────────────────────────────────────── */

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'note'; text: string };

export type LegalSection = {
  title?: string;
  blocks: Block[];
};

export type LegalDocument = {
  title: string;
  metaTitle: string;
  metaDescription: string;
  intro?: string;
  sections: LegalSection[];
};

/* ══ Conditions générales de réservation ══════════════════════ */

export const CGU: LegalDocument = {
  title: 'Conditions Générales',
  metaTitle: 'Conditions Générales — LAIT THYM SEL',
  metaDescription:
    'Conditions générales de réservation du restaurant LAIT THYM SEL à Angers : modalités, annulation, pénalités, paiement sécurisé.',
  sections: [
    {
      blocks: [
        {
          kind: 'p',
          text: 'Les présentes Conditions Générales régissent les relations entre la SARL FG2M Restaurant Lait Thym Sel, SARL au capital de 10 000 euros, ayant son siège social à Angers, immatriculée sous le n° 830 927 380 RCS, exploitant le restaurant Lait Thym Sel (ci-après la « Société ») d’une part, et toute personne physique ou morale souhaitant effectuer une demande de réservation au sein du restaurant Lait Thym Sel (ci-après le « Client ») d’autre part.',
        },
        {
          kind: 'p',
          text: 'Le Client reconnaît expressément avoir pris connaissance et être lié par les présentes Conditions Générales dès lors qu’il a coché la case « J’accepte les Conditions Générales » dans le cadre du processus de réservation en ligne.',
        },
      ],
    },
    {
      title: 'Article 1 : Objet',
      blocks: [
        {
          kind: 'p',
          text: 'Les présentes Conditions Générales ont pour objet de déterminer les conditions dans lesquelles le Client peut effectuer, en ligne, par le biais du système de réservation accessible sur le site internet laitthymsel.com une demande de réservation en vue de bénéficier des services de restauration proposés par le restaurant Lait Thym Sel situé à Angers – 17, rue Boisnet.',
        },
      ],
    },
    {
      title: 'Article 2 : Modalités de réservation',
      blocks: [
        {
          kind: 'p',
          text: 'La réservation en ligne se fait par le biais du formulaire accessible à l’adresse https://www.laitthymsel.com/reservation/ propulsé par Zenchef.com. Il appartient au Client de remplir l’intégralité des champs du formulaire précité, et d’indiquer notamment la date à laquelle il souhaite bénéficier des prestations de restauration ainsi que le service (déjeuner – dîner), l’horaire et le nombre de couverts souhaités. En cas d’indisponibilité concernant la date de réservation demandée, le service de réservation peut lui proposer, si possible, une alternative qu’il appartient au Client d’accepter ou de refuser. L’empreinte bancaire sert de garantie à votre réservation mais ne constitue aucun débit, ni acompte.',
        },
        {
          kind: 'p',
          text: 'Le Client recevra ensuite une confirmation de la date de réservation définitive. Dans l’hypothèse où le Client ne recevrait pas de confirmation de sa réservation par courrier électronique, il lui appartient de contacter la Société dans les meilleurs délais.',
        },
      ],
    },
    {
      title: 'Article 3 : Annulation',
      blocks: [
        {
          kind: 'p',
          text: 'Le client dispose d’un délai de 12h précédant l’horaire de la réservation pour la modifier ou l’annuler. Passé ce délai, les demandes d’annulation seront traitées au cas par cas.',
        },
        {
          kind: 'p',
          text: 'Afin d’annuler une réservation dans le délai précité, le Client peut :',
        },
        {
          kind: 'list',
          items: [
            'envoyer un e-mail à l’adresse ci-contre : contact@laitthymsel.fr (date et heure de l’envoi du mail faisant foi) en précisant les détails de se réservation (nom, date, heure et nombre de couverts) ;',
            'par téléphone au 02 41 27 20 40 en précisant le nom, la date, l’heure et le nombre de couverts ayant fait l’objet de la réservation.',
          ],
        },
      ],
    },
    {
      title: 'Article 4 : Pénalités',
      blocks: [
        {
          kind: 'p',
          text: 'En cas de défaut de présentation du Client à la date et à l’heure prévue pour sa réservation et si la réservation n’a pas été annulée dans les conditions prévues à l’article 3 ci-dessus, le Client se verra appliquer une pénalité. Le montant de ladite pénalité est fixée à 500 euros par couverts réservés. La perception de cette pénalité sera effectuée automatiquement par la Société, par le biais du numéro de carte bancaire précitée.',
        },
      ],
    },
    {
      title: 'Article 5 : Paiement sécurisé',
      blocks: [
        {
          kind: 'p',
          text: 'Le restaurant Lait Thym Sel, via son outil de réservation, utilise le système de paiement sécurisé Payzen afin de garantir le maximum de sécurité à ses Clients.',
        },
        {
          kind: 'p',
          text: 'Payzen assure des procédures de sécurité très rigoureuses à l’égard de la conservation et de la diffusion des informations : Payzen certifie que l’ensemble des phases de paiement à réaliser avec le Client est entièrement crypté et protégé. Le protocole utilisé est SSL (Secure Socket Layers) 128 bits couplé à de la monétique bancaire. Cela signifie que les informations liées à la commande et le numéro de la carte bancaire ne circulent pas en clair sur Internet.',
        },
        {
          kind: 'p',
          text: 'Au moment du renseignement de ses coordonnées bancaires, les données du Client sont transmises directement à Payzen et ne transitent par aucun intermédiaire. Ni la Société, ni Payzen ne connaîtront à aucun moment les informations relatives à la carte bancaire du Client.',
        },
      ],
    },
    {
      title: 'Article 6 : Responsabilité et garantie',
      blocks: [
        {
          kind: 'p',
          text: 'La Société s’engage, sauf cas de force majeure, à fournir les prestations de restauration au sein du restaurant Lait Thym Sel pour le nombre de couverts, au jour et à l’heure indiqués dans la confirmation de réservation adressée au Client par courrier électronique conformément aux dispositions de l’article 2 ci-dessus.',
        },
        {
          kind: 'p',
          text: 'La Société ne pourra en aucune manière être tenue responsable du défaut de présentation du Client au jour et à l’heure indiqués dans la confirmation de réservation liée, notamment sans que cette liste soit exhaustive, à un oubli, une erreur dans la date ou l’heure de réservation, au défaut de réception de la confirmation de sa réservation, etc. Les informations indiquées sur le site internet laitthymsel.com relatives notamment aux prix et au contenu des menus, de même que les photographies qu’il comporte ont une valeur purement indicative et ne sauraient constituer un engagement contractuel.',
        },
      ],
    },
    {
      title: 'Article 7 : Confidentialité et utilisation des données personnelles',
      blocks: [
        {
          kind: 'p',
          text: 'Les informations recueillies par le biais du formulaire de réservation font l’objet par la Société, d’un traitement informatique destiné à permettre la prise de réservation en ligne au sein du restaurant Lait Thym Sel. Conformément à la loi « informatique et libertés » du 6 janvier 1978, le Client bénéficie d’un droit d’accès et de rectification aux informations qui le concernent. Afin d’exercer ce droit et d’obtenir les informations le concernant, le Client doit s’adresser au restaurant Lait Thym Sel 17, rue Boisnet – 49100 Angers.',
        },
      ],
    },
    {
      title: 'Article 8 : Règlement des litiges',
      blocks: [
        {
          kind: 'p',
          text: 'Les présentes Conditions Générales sont soumises à la loi française. Tout différend entre la Société et un Client personne morale, relatif à leur exécution et à leurs suites sera soumis à la juridiction des tribunaux compétents d’Angers auxquels les Parties font expressément attribution de compétence y compris en cas de référé, d’appel en garantie ou de pluralité des défendeurs.',
        },
      ],
    },
  ],
};

/* ══ RGPD ═════════════════════════════════════════════════════ */

export const RGPD: LegalDocument = {
  title: 'Règlement général sur la Protection des Données',
  metaTitle: 'RGPD — LAIT THYM SEL',
  metaDescription:
    'Protection des données personnelles au restaurant LAIT THYM SEL à Angers : données collectées, finalités, conservation, exercice de vos droits.',
  intro:
    'Document de démonstration : cette page reprend la structure d\u2019une politique de confidentialité conforme au RGPD, à valider et compléter avec le restaurant avant toute mise en ligne.',
  sections: [
    {
      blocks: [
        {
          kind: 'p',
          text: 'Le Restaurant, s’engage, dans le cadre de ses activités, à ce que la collecte et le traitement de vos données, effectués à partir de ses sites, soient conformes au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés du 6 janvier 1978 et à prendre toute précaution pour préserver la protection, la confidentialité et la sécurité des informations nominatives qui lui sont confiées ainsi qu’à respecter la vie privée de ses Internautes.',
        },
        {
          kind: 'p',
          text: 'Ainsi, conformément aux dispositions légales en vigueur, Le Restaurant s’engage sur les principes essentiels suivants :',
        },
        {
          kind: 'list',
          items: [
            'Transparence : nous vous fournissons toutes les informations utiles sur les finalités et les destinataires de vos données collectées ;',
            'Légitimité et pertinence : nous collectons et traitons uniquement les données nécessaires aux finalités déclarées ;',
            'Confidentialité et intégrité : nous mettons en place toutes les mesures techniques et organisationnelles raisonnables pour protéger vos données personnelles contre la divulgation, la perte, l’altération ou l’accès par un tiers non autorisé ;',
            'Conservation : nous conservons vos données personnelles et bancaires uniquement pendant le temps nécessaire aux fins du traitement ou du service déterminé ou pendant la durée nécessaire à l’accomplissement de la finalité pour laquelle elles ont été collectées ;',
            'Droit d’interrogation aux fins de modification/suppression de vos données personnelles : nous vous donnons la possibilité de modifier et de supprimer vos données personnelles en nous adressant une demande en ce sens.',
          ],
        },
        {
          kind: 'p',
          text: 'Le Restaurant peut apporter occasionnellement des modifications et des corrections à la présente politique de protection des données personnelles. Merci de la consulter régulièrement afin d’être informé des modifications apportées et de la manière dont celles-ci peuvent vous concerner.',
        },
      ],
    },
    {
      title: 'Votre consentement',
      blocks: [
        {
          kind: 'p',
          text: 'Le Restaurant collectera et utilisera vos informations personnelles uniquement lorsqu’il sera pertinent et légal de le faire. Pour la collecte des données, votre consentement sera systématiquement demandé de façon explicite. Vous n’êtes pas obligé de nous accorder ce consentement, mais si vous décidez de le refuser, votre participation à certaines activités peut alors être restreinte.',
        },
      ],
    },
    {
      title: 'Nature des données pouvant être collectées et leur finalité',
      blocks: [
        {
          kind: 'p',
          text: 'Nous ne recueillons que les données personnelles dont nous avons besoin pour vous offrir nos services et les améliorer. Ces données peuvent notamment être recueillies dans le cadre :',
        },
        {
          kind: 'list',
          items: [
            'de la visite de nos services en ligne ainsi de sites partenaires et/ou applications, tels que Zenchef, SecretBox ;',
            'd’une réservation en ligne, par téléphone ;',
            'de vos achats de nos produits (e-boutique, cadeaux) et de l’utilisation de nos services ;',
            'de la diffusion d’information sur nos offres produits et actualités ainsi que la diffusion de newsletters ;',
            'de votre venue au Restaurant.',
          ],
        },
        {
          kind: 'p',
          text: 'Nous recueillons des données personnelles ou professionnelles directes, telles que le nom, le prénom, l’adresse postale, l’adresse de courrier électronique, le numéro de téléphone et coordonnées professionnelles.',
        },
        {
          kind: 'p',
          text: 'La société Payzen, notre prestataire de services de paiement en ligne, sera amenée à collecter vos données bancaires, telles que le numéro de carte bleue, la date de validité de la carte bleue et le cryptogramme dans le cadre d’une réservation.',
        },
        {
          kind: 'p',
          text: 'A titre occasionnel, Le Restaurant pourra également vous demander la communication des données bancaires susvisées dans le cadre d’une réservation.',
        },
        {
          kind: 'p',
          text: 'Conformément à la règlementation en vigueur, nous ne collectons en aucun cas les catégories particulières de données personnelles que sont les données qui révèlent l’origine raciale ou ethnique, les opinions politiques, les convictions philosophiques ou l’appartenance syndicale, les données personnelles génétiques, les données personnelles biométriques aux fins d’identifier une personne physique de manière unique…',
        },
      ],
    },
    {
      title: 'Nos mesures de sécurisation de vos données',
      blocks: [
        {
          kind: 'p',
          text: 'Respecter votre droit à la protection, à la sécurité et à la confidentialité de vos données est notre priorité. Le Restaurant s’engage à maintenir un environnement informatique sécurisé et à mettre en œuvre des mesures adaptées au degré de sensibilité de vos données personnelles pour les protéger contre toute intrusion malveillante, toute perte, altération ou divulgation à des tiers non autorisés.',
        },
        {
          kind: 'p',
          text: 'Toutes les données personnelles étant confidentielles, leur accès est limité aux collaborateurs du Restaurant, ou prestataires agissant pour le compte du Restaurant, qui en ont besoin dans le cadre de l’exécution de leurs missions. Toutes les personnes ayant accès à vos données sont liées par un devoir de confidentialité et sont tenues de respecter le règlement de Protection des Données Personnelles du Restaurant.',
        },
      ],
    },
    {
      title: 'Durée de conservation des données collectées',
      blocks: [
        {
          kind: 'p',
          text: 'Nous vous rappelons que vous avez le droit de faire supprimer vos données personnelles à tout instant.',
        },
        {
          kind: 'p',
          text: 'Si vous n’avez pas demandé à faire supprimer vos données personnelles celle-ci seront gardées seulement pour le temps qui est raisonnablement nécessaire pour fournir le service, l’améliorer et satisfaire aux demandes légales applicables. Cela signifie que nous pouvons garder vos données personnelles quelque temps après que vous ayez cessé d’utiliser nos services ou le site internet. Au-delà, vos données personnelles seront supprimées de toutes nos bases de données.',
        },
        {
          kind: 'p',
          text: 'Dans le respect des obligations légales Le Restaurant conserve vos données consommateur et bancaires pendant le temps nécessaire aux fins du traitement ou du service déterminé ou pendant la durée nécessaire à l’accomplissement de la finalité pour laquelle elles ont été collectées.',
        },
      ],
    },
    {
      title: 'Lieu de stockage et de transfert des données collectées',
      blocks: [
        {
          kind: 'p',
          text: 'Les données sont stockées par Le Restaurant dans ses centres de traitement ou dans ceux de ses sous-traitants, dans le respect de la législation Française et de la réglementation Européenne. En cas de sous-traitance les prestataires seront liés par un contrat avec Le Restaurant. Ce contrat assure un haut niveau de confidentialité, et exige que le sous-traitant mette en œuvre toutes les mesures techniques nécessaires de façon continue pour garder les données personnelles de manière sécurisée. Dans tous les cas vos données sont stockées dans des centres traitement localisés en France ou dans un pays de l’Union Européenne. Nos sous-traitants et prestataires de services peuvent être destinataires de vos données personnelles dans le cadre strict de la réalisation des prestations que nous leur confions (exemple : hébergement du site internet). Ces sous-traitants sont systématiquement établis en France ou dans un pays de l’union Européenne et sont tenus, en vertu d’un contrat rendu obligatoire par la loi, de préserver la confidentialité et la sécurité de vos informations personnelles et de les traiter uniquement selon les instructions spécifiques du Restaurant. Certaines données personnelles peuvent aussi être adressées à des tiers pour satisfaire aux obligations légales, réglementaires ou conventionnelles ou aux autorités légalement habilitées.',
        },
      ],
    },
    {
      title: 'Conditions d’exercice de vos droits concernant vos données personnelles',
      blocks: [
        {
          kind: 'p',
          text: 'Conformément à la règlementation en vigueur, vous disposez d’un droit d’interrogation, de modification, de rectification, de suppression/oubli et d’opposition au traitement et à la diffusion de vos données personnelles ainsi qu’un droit à la portabilité de vos données personnelles. Ainsi, vous êtes en droit de nous demander de vous fournir toutes les données en notre possession vous concernant. Vous pouvez aussi demander à ce que vos données personnelles soient supprimées, corrigées, modifiées ou transférées à un Tiers.',
        },
        {
          kind: 'p',
          text: 'Si vous souhaitez faire appliquer un de ces droits merci de contacter le restaurant Lait Thym Sel 17 rue Boisnet à Angers.',
        },
        {
          kind: 'p',
          text: 'Vous pouvez également vous rapprocher des sites de réservation en ligne partenaires suivants pour exercer vos droits pour les données déposées sur lesdits sites, tels que :',
        },
        {
          kind: 'list',
          items: [
            'Zenchef – Service marketing – 120-122 rue Réaumur 75002 Paris ;',
            'SecretBox – https://www.secretbox.fr/nous-contacter',
          ],
        },
        {
          kind: 'p',
          text: 'Si vous estimez être victime d’une violation de vos droits, vous avez la possibilité d’introduire une réclamation auprès de la Commission Nationale de l’informatique et des Libertés (CNIL).',
        },
      ],
    },
  ],
};

/* ══ Mentions légales ═════════════════════════════════════════ */

export const MENTIONS: LegalDocument = {
  title: 'Mentions légales',
  metaTitle: 'Mentions légales — LAIT THYM SEL',
  metaDescription:
    'Mentions légales du site du restaurant LAIT THYM SEL à Angers : éditeur, hébergeur, propriété intellectuelle, cookies.',
  intro:
    'Document de démonstration : cette page reprend la structure de mentions légales conformes, à valider et compléter avec le restaurant (notamment créateur, hébergeur et crédits photo définitifs) avant toute mise en ligne.',
  sections: [
    {
      title: '1 – Informations',
      blocks: [
        {
          kind: 'p',
          text: 'Les informations publiées, y compris dans leur aspect et leurs caractéristiques, sur le site internet laitthymsel.com sont non contractuelles. Lait Thym Sel a fait tous les efforts pour s’assurer que les informations accessibles par l’intermédiaire de son site web sont exactes. Cependant, nous ne garantissons en aucune manière que ces informations sont exactes, complètes et à jour. Lait Thym Sel n’assure aucune garantie, expresse ou tacite, concernant tout ou partie de son site web. En aucun cas, elle ne peut être tenu pour responsable d’un quelconque dommage direct ou indirect, quelle qu’en soit la nature, découlant de l’utilisation de son site web.',
        },
      ],
    },
    {
      title: '2 – Droits de propriété intellectuelle et industrielle',
      blocks: [
        {
          kind: 'p',
          text: 'Le site web du Restaurant Lait Thym Sel est une œuvre de l’esprit protégée par les lois de la propriété intellectuelle tels que prévus au livre I, titres I et II du code de la propriété intellectuelle en sa partie législative. Le site et chacun des éléments qui le composent sont la propriété exclusive de la société Lait Thym Sel. Toute reproduction ou représentation, intégrale ou partielle, du site ou de l’un quelconque des éléments qui le composent, sans le consentement écrit de son propriétaire, est interdite de même que leur altération. L’internaute ne peut ainsi modifier, reproduire, adapter tout produit y compris tout ou partie du site internet et les données qu’il contient (y compris photos). L’internaute ne peut copier par quelque moyen que ce soit, télécharger, commercialiser, revendre, distribuer, retransmettre, publier, réaliser un téléchargement automatisé, et ce sous une forme quelconque toute donnée disponibles ou hébergées sur le site. Le non-respect de cette interdiction constitue une contrefaçon pouvant engager la responsabilité civile et pénale du contrefacteur. En outre, les tiers propriétaires des contenus contrefaits, quelle que soit leur nature, sont fondés d’intenter une action en justice l’encontre des contrefacteurs. Cette disposition s’applique également aux internautes de passage.',
        },
        {
          kind: 'p',
          text: 'Les marques et noms de domaine qui apparaissent sur le site web du Restaurant Lait Thym Sel sont la propriété exclusive de la société Lait Thym Sel. Toute reproduction ou utilisation de ces marques ou noms de domaine, de quelque manière et à quelque titre que ce soit, est interdite.',
        },
      ],
    },
    {
      title: '3 – Gestion des données',
      blocks: [
        {
          kind: 'p',
          text: 'Afin d’améliorer la qualité du service et de l’accueil, le Restaurant Lait Thym Sel est susceptible de conserver celles de vos données personnelles qui sont inscrites sur le formulaire que vous remplissez. Seul le Restaurant Lait Thym Sel est destinataire de ces données personnelles.',
        },
        {
          kind: 'p',
          text: 'Le Restaurant Lait Thym Sel est susceptible de transmettre ces données personnelles à ses partenaires. Conformément à la loi n° 78-17 du 6 janvier 1978 relative à l’informatique, aux fichiers et aux libertés, vous disposez d’un droit d’accès, de modification, de suppression et d’opposition au traitement de vos données personnelles et à leur utilisation à des fins de prospection. Pour toute rectification des données personnelles concernant l’utilisateur, il est possible de s’adresser directement au Restaurant Lait Thym Sel et ce en conformité avec la loi.',
        },
        {
          kind: 'p',
          text: 'Les messages envoyés sur le réseau internet peuvent être interceptés. Ne divulguez pas d’informations personnelles inutiles ou sensibles. Si vous souhaitez nous communiquer de telles informations, utilisez la voie postale.',
        },
      ],
    },
    {
      title: '4 – Modifications',
      blocks: [
        {
          kind: 'p',
          text: 'Lait Thym Sel se réserve le droit de modifier ou de corriger, à tout moment et sans préavis, les contenus de son site internet, quelle que soit leur nature.',
        },
      ],
    },
    {
      title: '5 – Utilisation du site',
      blocks: [
        {
          kind: 'p',
          text: 'Lait Thym Sel n’assure aucune garantie, expresse ou tacite, concernant tout ou partie de son site web. En aucun cas, Lait Thym Sel ne peut être tenu pour responsable d’un quelconque dommage direct ou indirect, quelle qu’en soit la nature, découlant de l’utilisation de son site web. Lait Thym Sel décline toutes responsabilités quant à la pertinence des informations fournies et à l’utilisation qu’un internaute est susceptible d’en faire.',
        },
      ],
    },
    {
      title: '6 – Liens hypertextes',
      blocks: [
        {
          kind: 'p',
          text: 'La mise en place de liens hypertextes en direction d’autres sites ou de ressources disponibles sur le réseau Internet, ne saurait engager la responsabilité de la société Lait Thym Sel ni celle de son hébergeur à raison des contenus proposés par les sites désignés. La création de liens hypertextes vers le site web du Restaurant Lait Thym Sel ne peut être faite qu’avec l’autorisation écrite et préalable de Lait Thym Sel.',
        },
      ],
    },
    {
      title: '7 – Cookies',
      blocks: [
        {
          kind: 'p',
          text: 'Lait Thym Sel souhaite implanter un « cookie » dans votre ordinateur. Un « cookie » ne nous permet pas de vous identifier. De manière générale, il enregistre des informations relatives à la navigation de votre ordinateur sur notre site (la langue d’affichage, la monnaie de préférence, l’affichage de codes GDS…) que nous pourrons lire lors de vos visites ultérieures. En l’espèce, il contient les informations que vous venez de nous fournir. Ainsi, vous n’aurez pas besoin, lors de votre prochaine visite, de remplir à nouveau le formulaire que nous vous avons proposé. La durée de conservation de ces informations dans votre ordinateur est de 1000 jours. Nous vous informons que vous pouvez vous opposer à l’enregistrement de « cookies » en configurant votre navigateur. Toutefois, nous attirons votre attention que le refus des cookies peut réduire la convivialité d’utilisation du site Lait Thym Sel.',
        },
        {
          kind: 'note',
          text: 'EN UTILISANT CE SITE VOUS DÉCLAREZ COMPRENDRE ET ACCEPTER LES TERMES CI-DESSUS.',
        },
      ],
    },
    {
      title: '8 – Informations sur le site',
      blocks: [
        {
          kind: 'p',
          text: 'En vertu de l’article 6 de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l’économie numérique, il est précisé aux utilisateurs du site laitthymsel.com l’identité des différents intervenants dans le cadre de sa réalisation et de son suivi :',
        },
        {
          kind: 'list',
          items: [
            'Propriétaire : Lait Thym Sel – SARL F2GM',
            'Adresse postale : 17, rue Boisnet – 49100 Angers',
            'Téléphone : 02 41 27 20 40',
            'E-mail : contact@laitthymsel.fr',
            'Capital social 10 000 € – RCS 830 927 380 – APE 5610A',
            'Créateur et Webmaster : à compléter selon le prestataire retenu pour ce projet',
            'Responsable publication : Lait Thym Sel – SARL F2GM (Le responsable publication est une personne physique ou une personne morale).',
            'Hébergeur : à compléter selon l\u2019hébergement retenu pour ce projet',
            'Crédit Photo : Laura Evrat (photographies du restaurant) ; certains visuels d\u2019illustration sont des photographies libres de droits, sous licence Unsplash — liste à finaliser selon les visuels définitivement retenus',
          ],
        },
      ],
    },
  ],
};
