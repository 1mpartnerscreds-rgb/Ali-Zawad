# 5-line self-critique

1. **§ 6 Photography still fails the build test.** A dev reading
   the guide with no access to me still doesn't know what to
   put in the `<img>` when the client hasn't sent photos yet.
   "Use the AIMS badge as a placeholder" is a rule; it's not
   image specs, alt-text policy, or aspect-ratio guidance.

2. **§ 12 Client kit is aspirational until the first paying
   client goes through it.** Day 5-8 "Build all five pages"
   silently absorbs where real projects actually diverge.

3. **The specimen renders the do/don't pairs cleanly on desktop
   but the "don't" simulations (gradient hero, 3-card grid) are
   too small to read as the failure mode they represent.** They
   look like tokens, not like the real bad examples they're
   modelling.

4. **The invoice-as-hero idea is stated as the direction's
   structural signature but the specimen only demonstrates a
   line-item table in the Do column of §11.** The homepage hero
   mock still uses a conventional hero, not the invoice-hero.

5. **§ 7 Components has anatomy for six of the seven components
   but only four render in the specimen (nav, buttons, price
   block, contact form).** Service card, proof block and footer
   are documented in the guide but absent from the specimen —
   so a dev can't check them against a rendered reference.

## Weakest section: § 6 Photography

Rewriting it now with concrete, followable specs.
