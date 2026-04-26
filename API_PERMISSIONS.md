# Rapport des Permissions et Rôles (Backend CyNapse)

Ce document récapitule les accès requis pour chaque endpoint de l'API, basé sur les annotations `@PreAuthorize` et la hiérarchie des rôles définie dans le backend.

## 🔑 Hiérarchie des Rôles
Les privilèges sont cumulatifs selon la hiérarchie suivante :
`USER` < `ADVANCED` < `EXPERT` < `ADMIN`

---

## 📂 Contrôleurs Standards (`/api/...`)

### 🛰️ Actuators (`/api/actuator`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste des actionneurs (filtrable par `roomId`) |
| `/get` | GET | Authentifié | Détails d'un actionneur spécifique par `id` |
| `/update-state` | POST | **EXPERT** | Modifier l'état d'un actionneur (`id`, `state`) |
| `/history` | GET | **ADVANCED** | Historique des 200 derniers changements d'état |

### 🔐 Authentification (`/api/auth`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/sign-up` | POST | Public | Inscription (soumis à validation admin) |
| `/sign-in` | POST | Public | Connexion (retourne l'utilisateur + Cookie JWT) |
| `/enable` | GET | Public | Activation du compte via token email |
| `/updatePassword`| POST | Authentifié | Changement du mot de passe personnel |
| `/authorize` | POST | **ADMIN** | Envoi de l'email de validation à un utilisateur |

### 🤖 Automatisations (`/api/automation`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste des règles (filtrable par `actuatorDeviceId`) |
| `/get` | GET | Authentifié | Détails d'une règle spécifique par `id` |

### 🗑️ Demandes de Suppression (`/api/device-delete-request`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/create` | POST | **EXPERT** | Créer une demande de suppression de device |
| `/my-list` | GET | **EXPERT** | Voir l'historique de ses propres demandes |

### 📰 Actualités (`/api/news`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste toutes les actualités publiées |
| `/get` | GET | Authentifié | Récupérer une news par son `slug` |

### 📊 Rapports & Exports (`/api/reports`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/sensors/{id}` | GET | **ADVANCED** | Rapport TXT des données d'un capteur |
| `/actuators/{id}`| GET | **ADVANCED** | Rapport TXT des données d'un actionneur |
| `/rooms/{id}` | GET | **ADVANCED** | Rapport TXT global pour une salle |

### 🏠 Salles (`/api/room`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste des salles avec leurs équipements |
| `/get` | GET | Authentifié | Détails complets d'une salle par `id` |

### 🌡️ Capteurs (`/api/sensor`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste des capteurs (filtrable par `roomId`) |
| `/get` | GET | Authentifié | Détails d'un capteur spécifique |
| `/readings` | GET | **ADVANCED** | Historique des 200 derniers relevés de mesure |

### 🚆 Transports (`/api/transport`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/rer-a/next` | GET | Authentifié | Prochains départs RER A (Station Châtelet) |

### 👤 Utilisateurs (`/api/user`)
| Endpoint | Méthode | Rôle Requis | Description |
| :--- | :---: | :--- | :--- |
| `/list` | GET | Authentifié | Liste simplifiée des profils utilisateurs |
| `/get` | GET | Authentifié | Voir un profil (Gagne +20 XP via `@AddUserExp`) |
| `/me` | GET | Authentifié | Infos détaillées de l'utilisateur courant |
| `/updateProfile` | POST | Authentifié | Mise à jour des informations personnelles |
| `/nextRole` | GET | Authentifié | Identifie le prochain rang de progression |
| `/expToNextRole` | GET | Authentifié | Calcul de l'XP restante avant promotion |
| `/expToRoleMapping`| GET | Authentifié | Grille de progression XP/Rôles |

---

## 🛠️ Administration (`/api/admin/...`)

**Tous les endpoints ci-dessous requièrent strictement le rôle ADMIN.**

### Gestion du Matériel & Structure
- **Salles (`/room`)** : Création, modification et suppression des salles.
- **Capteurs (`/sensor`)** : Enregistrement et retrait des capteurs du système.
- **Actionneurs (`/actuator`)** : Configuration des actionneurs physiques.

### Gestion Logique & Contenu
- **Automatisations (`/automation`)** : CRUD complet sur les règles et déclenchement manuel (`/evaluate-now`).
- **Actualités (`/news`)** : Rédaction, édition et suppression des articles news.
- **Demandes de Suppression (`/device-delete-request`)** : Revue (`approve`/`reject`) des requêtes envoyées par les experts.

### Gestion des Utilisateurs
- **Profils (`/user`)** : Modification complète des comptes (XP, activation, données privées).
- **Sécurité (`/updatePassword`)** : Possibilité pour l'admin de réinitialiser le mot de passe d'un tiers.
