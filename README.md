# Amawal — Dictionnaire kabyle

Dictionnaire en ligne de la langue kabyle : recherche publique, fiches de mots,
page de connexion et backoffice d'administration.

## Stack

- **Next.js 16** (App Router, Server Actions, TypeScript)
- **MongoDB** + Mongoose
- **Tailwind CSS 4**
- Auth par session JWT (jose) en cookie `httpOnly` + rôles (`admin` / `user`)
- Validation des formulaires avec Zod

## Fonctionnalités

| Route | Description |
|---|---|
| `/` | Dictionnaire public : recherche (mot, définition, traductions), filtre par lettre |
| `/mot/[id]` | Fiche détaillée : définition, traductions (fr/ar/en), exemples |
| `/login` | Connexion administrateur |
| `/admin` | Backoffice : liste des mots, modification, suppression |
| `/admin/nouveau` | Ajout d'un mot |
| `/api/mots`, `/api/mots/[id]` | API publique de lecture |

Le dossier `src/proxy.ts` protège `/admin` (redirection vers `/login` si non
connecté) — dans Next.js 16, *Middleware* s'appelle **Proxy**.

## Démarrage local

```bash
npm install

# Base de données (Docker)
docker compose up -d

# Configuration
cp .env.example .env.local
# → remplir MONGODB_URI, SESSION_SECRET (openssl rand -base64 32),
#   ADMIN_USERNAME, ADMIN_PASSWORD

# Compte admin + mots d'exemple
npm run seed

# Développement
npm run dev
```

Compte admin par défaut du seed : `admin` / valeur de `ADMIN_PASSWORD`.

## Déploiement gratuit

### 1. Base de données — MongoDB Atlas (gratuit)

1. Créer un compte sur [mongodb.com/atlas](https://www.mongodb.com/atlas) (plan M0, 512 Mo)
2. Créer un cluster → *Database Access* : utilisateur + mot de passe
3. *Network Access* : autoriser `0.0.0.0/0` (ou l'IP de Vercel)
4. *Connect → Drivers* : copier l'URI `mongodb+srv://…` dans `MONGODB_URI`

### 2. Application — Vercel (gratuit)

```bash
npm i -g vercel
vercel link
```

Puis sur [vercel.com](https://vercel.com) : *Import Git Repository*, ou via CLI :

```bash
vercel --prod
```

Variables d'environnement à définir (Settings → Environment Variables) :

- `MONGODB_URI`
- `SESSION_SECRET`
- `ADMIN_USERNAME` / `ADMIN_PASSWORD` (uniquement si tu relances `npm run seed` en local)

## Scripts

| Commande | Rôle |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production |
| `npm run lint` | ESLint |
| `npm run seed` | Crée l'admin + mots d'exemple (idempotent) |

## Architecture

```
src/
├── proxy.ts                  # garde d'accès /admin (ex-middleware)
├── lib/
│   ├── db.ts                 # connexion Mongoose (singleton)
│   ├── session.ts            # JWT jose, cookies httpOnly
│   ├── dal.ts                # verifySession / requireAdmin (vérif. en base)
│   ├── categories.ts         # constantes partagées client/serveur
│   ├── words.ts              # requêtes lecture → DTO
│   ├── models/               # schémas Mongoose (User, Word)
│   └── actions/              # Server Actions (auth, CRUD mots)
├── components/               # header, formulaires (client)
└── app/
    ├── page.tsx              # dictionnaire public
    ├── mot/[id]/             # fiche mot
    ├── login/                # connexion
    ├── admin/                # backoffice (protégé)
    └── api/mots/             # API publique
```

## Sécurité

- Cookie de session `httpOnly` + `SameSite=Lax`, signé HS256 (7 jours)
- Proxy = check optimiste ; `requireAdmin()` revérifie en base avant chaque écriture
- Mots de passe hachés avec bcrypt, validation Zod côté serveur
- Requêtes API de lecture uniquement ; écritures réservées aux server actions admin
