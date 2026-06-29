import Image from "next/image";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className='text-gray-500/80 pt-8 px-4 md:px-16 lg:px-24 xl:px-32'>

                <div className='flex flex-wrap justify-between gap-8 md:gap-6'>

                    {/* Logo + description + réseaux */}
                    <div className='w-full md:max-w-80'>
                        <div className="flex gap-2 items-center">
                            <Image src="/logos/logo/ShopBook.png" alt="Logo" width={32} height={32} className="object-contain rounded" />
                            <span>
                                <span className="font-bold tracking-tight text-2xl text-vert-foncee">Shop</span>
                                <span className="font-bold tracking-tight text-2xl text-orange">Book</span>
                            </span>
                        </div>

                        <p className='text-sm mt-3'>
                            Le carnet numérique qui remplace le cahier de crédits. Pensé pour les commerçants mauritaniens.
                        </p>

                        <div className='flex items-center gap-3 mt-3'>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13.5 9H15V6.5h-1.5c-1.933 0-3.5 1.567-3.5 3.5v1.5H8v3h2.5V21h3v-7.5H16l.5-3h-3z" />
                            </svg>
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M4.98 3.5C3.88 3.5 3 4.38 3 5.48c0 1.1.88 1.98 1.98 1.98h.02c1.1 0 1.98-.88 1.98-1.98C6.98 4.38 6.1 3.5 4.98 3.5zM3 8.75h3.96V21H3V8.75zm6.25 0h3.8v1.68h.05c.53-.98 1.82-2.02 3.75-2.02 4.01 0 4.75 2.64 4.75 6.07V21H17v-5.63c0-1.34-.03-3.07-1.88-3.07-1.88 0-2.17 1.47-2.17 2.98V21H9.25V8.75z" />
                            </svg>
                        </div>
                    </div>

                    {/* Liens — grille 2 colonnes sur mobile */}
                    <div className='w-full grid grid-cols-2 md:contents gap-8'>

                        <div>
                            <p className='text-sm text-gray-800 font-semibold'>Produit</p>
                            <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                <li><a href="#">Fonctionnalités</a></li>
                                <li><a href="#">Tarifs</a></li>
                                <li><a href="#">Démo</a></li>
                            </ul>
                        </div>

                        <div>
                            <p className='text-sm text-gray-800 font-semibold'>Entreprise</p>
                            <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                <li><a href="/a-propos" rel="noopener noreferrer">À propos</a></li>
                                <li><a href="#">Contact</a></li>
                                <li><a href="#">Carrière</a></li>
                            </ul>
                        </div>

                        <div>
                            <p className='text-sm text-gray-800 font-semibold'>Support</p>
                            <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                <li><a href="#">Centre d&apos;aide</a></li>
                                <li><a href="#">WhatsApp</a></li>
                            </ul>
                        </div>

                        <div>
                            <p className='text-sm text-gray-800 font-semibold'>Juridique</p>
                            <ul className='mt-3 flex flex-col gap-2 text-sm'>
                                <li><a href="/politique-confidentialite" rel="noopener noreferrer">Politique de confidentialité</a></li>
                                <li><a href="/conditions-utilisation" rel="noopener noreferrer">Conditions d&apos;utilisation</a></li>
                            </ul>
                        </div>

                    </div>
                </div>

                <hr className='border-gray-300 mt-8' />

                <div className='flex flex-row md:flex-row gap-1 items-center justify-between py-5 text-sm'>
                    <p>© {new Date().getFullYear()} <a href="#">ShopBook</a></p>
                    <p>Tous droits réservés.</p>
                </div>

            </div>
        </footer>
    );
}