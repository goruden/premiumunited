import { useTranslation } from 'react-i18next';
import NumberFlow from "@number-flow/react";
import { motion, useInView } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const Shipment = () => {
    const { t } = useTranslation();
    const shipmentRaw = t('shipment', { returnObjects: true });
    const shipment = Array.isArray(shipmentRaw) ? shipmentRaw : [];

    return (
        <div className="max-w-6xl mx-auto flex flex-col pb-20 lg:pb-30 px-10 text-center">
            <div className='justify-items-center'>
                <p className='mb-3 text-2xl md:text-3xl font-semibold'>{t("ShipmentPage.title")}</p>
                <p>{t("ShipmentPage.line1")}</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mt-10">
                {shipment.map((member: any, idx: number) => (
                <AnimatedNumberCard key={idx} member={member} index={idx} />
                ))}
            </div>
        </div>
    );
};

const AnimatedNumberCard = ({ member, index }: { member: any; index: number }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.6 });
    const [value, setValue] = useState(0);

    useEffect(() => {
        if (isInView) {
        let start = 0;
        const end = parseInt(member.description);
        const duration = 150; 
        const stepTime = 20;
        const steps = duration / stepTime;
        const increment = end / steps;
        const interval = setInterval(() => {
            start += increment;
            if (start >= end) {
            start = end;
            clearInterval(interval);
            }
            setValue(Math.floor(start));
        }, stepTime);

        return () => clearInterval(interval);
        }
    }, [isInView, member.description]);

    return (
        <motion.div
        ref={ref}
        className="group flex flex-col items-center rounded-2xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.7 }}
        >
        <div className="mt-1 text-xl md:text-2xl font-semibold">
            <NumberFlow value={value} />
        </div>
        <hr className="w-1/2 border-2 border-red-600 my-5" />
        <div className="text-neutral-700 dark:text-neutral-200">
            {member.name}
        </div>
        </motion.div>
    );
};

export default Shipment;
