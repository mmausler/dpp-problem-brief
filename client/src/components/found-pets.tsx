
const FoundPets = ({ pets }) => (
    <div>
        <h2>Thank you for registering</h2>
        <p>
            We have some good news. Your
            {pets.map(
                (p, idx) =>
                    idx === pets.length - 1 ?
                    `${pets.length > 1 ? ' and' : ''} ${p.type} ${p.name} ${pets.length > 1 ? 'have ' : 'has '}`
                    :
                    ` ${p.type} ${p.name}, `
            )}
            been found!
        </p>
        <p>Please contact us at (800) CALL-GOVT or info@agency.gov for further information</p>
    </div>
);

export default FoundPets;
