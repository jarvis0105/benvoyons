import { RESTAURANT, ADDRESS_ONE_LINE } from '@/lib/restaurant';
import { STOCK } from '@/lib/stock';
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Kicker, Title } from "@/components/editorial";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useLang } from "@/i18n";
import { ctaClass } from "@/lib/cta";

function makeFormSchema(t: (fr: string) => string) {
  return z.object({
    nom: z.string().min(2, t("Le nom est requis")),
    email: z.string().email(t("Email invalide")),
    telephone: z.string().min(10, t("Numéro de téléphone invalide")),
    message: z.string().min(10, t("Le message est trop court")),
  });
}

export default function Contact() {
  const { t } = useLang();
  const { toast } = useToast();

  const formSchema = makeFormSchema(t);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: "",
      email: "",
      telephone: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    /* Pas de backend dans ce projet (aucune API, aucun service d'envoi
       configuré) : plutôt que de laisser croire à un envoi qui ne se
       produit pas (l'ancien comportement, un simple console.log), on
       ouvre le client mail du visiteur avec le message pré-rempli,
       adressé au restaurant. Ça fonctionne sans aucune dépendance ni
       clé d'API — mais ça reste un pense-bête à remplacer par un vrai
       service d'envoi (Resend, Formspree, EmailJS...) si le restaurant
       valide ce site pour de vrai : le visiteur doit encore cliquer
       "envoyer" dans son propre client mail. */
    const subject = `Demande de contact — ${values.nom}`;
    const body = [
      `Nom : ${values.nom}`,
      `Téléphone : ${values.telephone}`,
      `E-mail : ${values.email}`,
      '',
      values.message,
    ].join('\n');
    window.location.href = `mailto:${RESTAURANT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast({
      title: t("Votre message est prêt à être envoyé"),
      description: t("Votre client mail va s'ouvrir avec votre message pré-rempli : il ne restera qu'à cliquer sur envoyer."),
    });
    form.reset();
  }

  return (
    <Layout>
      <SEO
        title={t("Contact & Réservation — LAIT THYM SEL")}
        description={t(
          "Contactez-nous pour réserver votre table ou obtenir plus d'informations. Service du soir du mardi au samedi, déjeuner le mercredi et le vendredi.",
        )}
      />
      
      {/* ── Écran scindé : image à gauche, formulaire à droite ──
          Le principe est repris d'Ochre, l'exécution est la nôtre :
          l'image est collée au bord (pas de marge, pas de conteneur),
          le formulaire respire dans la moitié droite, et les champs
          sont réduits à un simple filet inférieur plutôt qu'à des
          boîtes bordées — cohérent avec les filets déjà employés
          ailleurs sur le site.

          `lg:sticky` sur la colonne image : elle reste en place tant
          qu'on remplit le formulaire, au lieu de défiler hors champ. */}
      <section className="relative grid grid-cols-1 lg:grid-cols-2">
        {/* Des huîtres sur la glace (photo d'origine) : le contraste
            froid tranche avec l'ivoire du formulaire à droite. */}
        <div
          className="relative h-[42vh] min-h-[280px] overflow-hidden lg:sticky lg:top-0 lg:h-screen lg:min-h-0"
        >
          <img
            src={STOCK.huitres.src}
            srcSet={STOCK.huitres.srcSet}
            sizes="(max-width: 900px) 100vw, 50vw"
            alt={t("Des huîtres sur la glace")}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        <div className="flex items-center justify-center px-6 py-16 md:px-12 lg:py-28">
          <div className="w-full max-w-md">
            <Kicker>{t("Une question ? · Angers")}</Kicker>
            <Title as="h1" before={t("Écrivez-")} accent={t("nous")} sub={t("Nous répondons personnellement")} size="lg" />
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="reveal-fade mt-10 space-y-7"
                style={{ ["--reveal-delay" as string]: "300ms" }}
              >
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t("Nom complet")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                          {...field}
                          data-testid="input-contact-nom"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {t("Email")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                            {...field}
                            data-testid="input-contact-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                          {t("Téléphone")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            className="h-11 rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                            {...field}
                            data-testid="input-contact-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
                        {t("Message")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-[110px] resize-none rounded-none border-0 border-b border-border bg-transparent px-0 focus-visible:border-brand focus-visible:ring-0"
                          {...field}
                          data-testid="input-contact-message"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <a
                    href={RESTAURANT.phoneHref}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    data-testid="link-contact-call"
                  >
                    <Phone className="h-4 w-4" />
                    {RESTAURANT.phone}
                  </a>
                  <button
                    type="submit"
                    className={ctaClass(false)}
                    data-testid="button-contact-submit"
                  >
                    {t("Envoyer")}
                    <span aria-hidden="true">→</span>
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </section>

      {/* Privatisation & événements — mentionnée ici plutôt que sur une
          page à part : c'est une demande qui passe par le même
          formulaire de contact, pas un service distinct à part
          entière. */}
      <section className="border-t border-border bg-card">
        <div className="container mx-auto px-6 py-14 md:px-12 md:py-20">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
            <Users className="h-5 w-5 text-brand" aria-hidden="true" />
            <h2 className="font-serif text-2xl text-foreground md:text-3xl">
              {t("Privatisation & Événements")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t("Célébrez vos moments importants dans notre salle à manger. Pour un mariage intime, un anniversaire ou un repas d'affaires, nous privatisons le restaurant et créons un menu sur mesure pour vos convives.")}
            </p>
            <a
              href={`mailto:${RESTAURANT.email}?subject=${encodeURIComponent("Demande de privatisation")}`}
              className={ctaClass(false)}
              data-testid="link-contact-privatisation"
            >
              {t("Demander un devis")}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

    </Layout>
  );
}