# Tests E2E — couverture

## Ce qui est couvert

**6 écrans sur 6, par 6 tests.**

| Écran | Route | Scénario | Fichier |
|---|---|---|---|
| Inscription | `/register` | créer un compte, arriver sur le login | `register.cy.ts` |
| Connexion | `/login` | s'authentifier, stocker le token, arriver sur la liste | `login.cy.ts` |
| Liste | `/students` | afficher les étudiants | `students.cy.ts` |
| Détail | `/students/:id` | consulter un étudiant, le supprimer | `students.cy.ts` |
| Ajout | `/students/new` | créer un étudiant | `students.cy.ts` |
| Modification | `/students/:id/edit` | modifier un étudiant | `students.cy.ts` |

Les cinq opérations CRUD et les deux parcours d'authentification sont donc
tous exercés de bout en bout.

## Pourquoi pas un pourcentage de lignes

Cypress pilote l'application **compilée**, dans un vrai navigateur. Pour obtenir un
pourcentage de lignes, il faut instrumenter le code au moment du build (Istanbul),
afin que l'application expose un compteur d'exécution.

Ce projet utilise le builder `@angular-devkit/build-angular:application`, basé sur
esbuild — celui livré par défaut depuis Angular 17 et présent dès le commit initial
du starter. Ce builder n'expose pas de point d'injection pour cette instrumentation ;
les outils existants (`ngx-build-plus`, loaders Istanbul) visent webpack, le builder
des versions antérieures.

La couverture E2E est donc exprimée en **écrans et parcours utilisateurs** plutôt
qu'en lignes de code. C'est aussi ce que mesure réellement un test de bout en bout :
il vérifie qu'un parcours fonctionne, pas que telle ligne a été exécutée.

Les couvertures par lignes existent par ailleurs, là où elles ont du sens :
- **back-end** : 82,7 % (JaCoCo)
- **front-end** : ~84 % (Jest)

## Principes retenus

- **Cas nominaux uniquement** — les cas d'erreur ne sont pas testés (consigne du projet).
- **Appels API mockés** avec `cy.intercept` (consigne du projet). Ni le back ni la base
  de données n'ont besoin de tourner.
- **Tests indépendants** — chacun définit ses propres réponses serveur et part d'un
  navigateur vierge. Ils peuvent être joués dans n'importe quel ordre, seuls ou
  ensemble.
- Pour les écrans protégés par le guard, le token est placé dans `localStorage` avant
  le démarrage de l'application (`onBeforeLoad`) plutôt qu'en rejouant la connexion :
  cela évite de rendre les tests CRUD dépendants du parcours de login.

## Lancer les tests

```bash
# terminal 1 — servir l'application
npm start

# terminal 2 — mode interactif (écriture et débogage)
npm run e2e

# ou mode headless (validation finale)
npm run e2e:run
```

Le back-end reste éteint : toutes les réponses sont fournies par `cy.intercept`.
