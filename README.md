# DobreHaslo2

Generator haseł i fraz (passphrases) napisany w **Blazor WebAssembly** z .NET 8. Aplikacja działa całkowicie po stronie przeglądarki bez wysyłania danych na serwer.

## Funkcjonalność

### Generator haseł
- Generowanie losowych haseł o konfigurowalnej długości (1–1000 znaków)
- Wybór zestawów znaków:
  - Małe litery angielskie (a–z)
  - Duże litery angielskie (A–Z)
  - Małe litery polskie (ąćęłńóśżź)
  - Duże litery polskie (ĄĆĘŁŃÓŚŻŹ)
  - Znaki specjalne (!@#$%^&* itp.)
  - Cyfry (0–9)
  - Liczby binarne (01)
  - Liczby szesnastkowe (0–9, a–f)
- Możliwość dodania własnych znaków
- Generowanie wielu haseł jednocześnie (1–1000)

### Generator fraz (passphrases)
- Generowanie losowych fraz złożonych ze słów polskich
- Domyślna lista około 900 popularnych polskich słów (długości 4–12 znaków)
- Możliwość dostosowania listy słów
- Regulowana liczba słów w frazie (1–20)

### Analiza bezpieczeństwa
- Obliczanie złożoności hasła/frazy w bitach
- Obliczanie liczby możliwych kombinacji
- Szacowanie czasu ataku brute-force

### Bezpieczeństwo
- Generowanie losowych wartości przy użyciu `RandomNumberGenerator` (.NET)
- Wszystkie operacje wykonywane lokalnie w przeglądarce
- Otwarty kod źródłowy na [GitHub](https://github.com/geek197/DobreHaslo2), licencja MIT

## Wymagania

- **.NET 8 SDK** lub nowsze
- Nowoczesna przeglądarka obsługująca WebAssembly (Chrome, Firefox, Edge, Safari)

## Instalacja i kompilacja

### 1. Klonowanie repozytorium
```bash
git clone https://github.com/geek197/DobreHaslo2.git
cd DobreHaslo2
```

### 2. Kompilacja projektu
```bash
cd DobreHaslo2
dotnet build
```

### 3. Uruchomienie w trybie development
```bash
dotnet run
```

Aplikacja będzie dostępna na `https://localhost:5001` lub `http://localhost:5000`.

### 4. Publikacja (build produkcyjny)
```bash
dotnet publish -c Release
```

Pliki produkcyjne znajdą się w katalogu `bin/Release/net8.0/publish/wwwroot/`.

## Struktura projektu

```
DobreHaslo2/
├── Pages/
│   └── PasswordGenerator.razor         # Główny komponent aplikacji
├── wwwroot/
│   ├── index.html                      # Strona HTML z tagami SEO
│   ├── css/
│   │   └── app.css                     # Style aplikacji
│   ├── js/
│   │   └── wordlist-loader.js          # Loader słów z obsługą kodowania
│   └── wordlists/
│       └── polish-1000.txt             # Lista polskich słów
├── App.razor                            # Komponent główny Blazor
├── Program.cs                           # Konfiguracja aplikacji
├── _Imports.razor                       # Globalne importy
└── DobreHaslo2.csproj                  # Plik projektu
```

## Licencja

Projekt jest dostępny na licencji MIT. Szczegóły znajdują się w pliku `LICENSE`.

## Wsparcie

Aby zgłosić błędy lub zasugerować nowe funkcje, utwórz issue na [GitHub](https://github.com/geek197/DobreHaslo2/issues).