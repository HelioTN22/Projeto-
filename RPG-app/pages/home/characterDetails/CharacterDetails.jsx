import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    TextInput, 
    Button, 
    SafeAreaView, 
    ScrollView 
} from 'react-native'; 
import Icon from 'react-native-vector-icons/FontAwesome5'; 
import { useRoute } from '@react-navigation/native'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const CharacterDetails = ({ navigation }) => {
    const route = useRoute();
    const { character } = route.params;

    const [name, setName] = useState(character.name);
    const [life, setLife] = useState(character.life);
    const [CA, setCA] = useState(character.CA);
    const [mana, setMana] = useState(character.mana);
    const [items, setItems] = useState(character.items);
    const [skills, setSkills] = useState(character.skills || []);
    const [speed, setSpeed] = useState(character.speed || '30m');
    const [initiative, setInitiative] = useState(character.initiative || '0');
    const [isEditing, setIsEditing] = useState(false);

    const [attributes, setAttributes] = useState({
        Força: 10,
        Destreza: 10,
        Constituição: 10,
        Inteligência: 10,
        Sabedoria: 10,
        Carisma: 10,
    });

    const saveCharacterData = async () => {
        try {
            const characterData = {
                name,
                life,
                CA,
                mana,
                items,
                skills,
                attributes,
                speed,
                initiative,
            };
            await AsyncStorage.setItem(`@character_${character.id}`, JSON.stringify(characterData));
            alert('Dados salvos com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar os dados: ', error);
        }
    };

    const loadCharacterData = async () => {
        try {
            const savedCharacterData = await AsyncStorage.getItem(`@character_${character.id}`);
            if (savedCharacterData) {
                const parsedData = JSON.parse(savedCharacterData);
                setName(parsedData.name);
                setLife(parsedData.life);
                setCA(parsedData.CA);
                setMana(parsedData.mana);
                setItems(parsedData.items);
                setSkills(parsedData.skills);
                setAttributes(parsedData.attributes || attributes);
                setSpeed(parsedData.speed || speed);
                setInitiative(parsedData.initiative || initiative);
            }
        } catch (error) {
            console.error('Erro ao carregar os dados: ', error);
        }
    };

    useEffect(() => {
        loadCharacterData();
    }, []);

    const handleSave = () => {
        saveCharacterData();
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleAttributeChange = (key, value) => {
        setAttributes({ ...attributes, [key]: value });
    };

    const handleAddSkill = () => {
        setSkills([...skills, { name: 'Nova Perícia', value: '' }]); // Adiciona um objeto com nome e valor
    };

    const handleRemoveSkill = (index) => {
        const updatedSkills = skills.filter((_, i) => i !== index);
        setSkills(updatedSkills);
    };

    const handleSkillChange = (index, field, value) => {
        const updatedSkills = [...skills];
        updatedSkills[index][field] = value;
        setSkills(updatedSkills);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.title}>Detalhes do Personagem</Text>
                </View>
                <View style={styles.characterContainer}>
                    <Image source={{ uri: character.image }} style={styles.characterImage} />
                    <Text style={styles.characterName}>{name}</Text>
                </View>

                <TouchableOpacity style={styles.deleteButton} onPress={() => alert('Personagem excluído!')}>
                    <Icon name="trash" size={30} color="red" />
                </TouchableOpacity>

                {/* Contêiner estilizado para Atributos */}
                <View style={styles.detailsContainer}>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.label}>Atributos:</Text>
                        <View style={styles.attributesGrid}>
                            {Object.keys(attributes).map((key) => (
                                <View key={key} style={styles.attributeBox}>
                                    <Text style={styles.attributeName}>{key}</Text>
                                    <TextInput 
                                        style={styles.attributeValue} 
                                        value={String(attributes[key])} 
                                        onChangeText={(value) => handleAttributeChange(key, value)}
                                        editable={isEditing}
                                        keyboardType="numeric"
                                    />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Campos adicionais */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.label}>Campos Adicionais:</Text>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsColumn}>Vida:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(life)}
                                onChangeText={(value) => setLife(value)}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsColumn}>Iniciativa:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(initiative)}
                                onChangeText={(value) => setInitiative(value)}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsColumn}>CA:</Text>
                            <TextInput
                                style={styles.input}
                                value={String(CA)}
                                onChangeText={(value) => setCA(value)}
                                editable={isEditing}
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.statsRow}>
                            <Text style={styles.statsColumn}>Deslocamento:</Text>
                            <TextInput
                                style={styles.input}
                                value={speed}
                                onChangeText={(value) => setSpeed(value)}
                                editable={isEditing}
                            />
                        </View>
                    </View>

                    {/* Perícias */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.label}>Perícias:</Text>
                        {skills.map((skill, index) => (
                            <View key={index} style={styles.skillContainer}>
                                <TextInput 
                                    style={styles.input} 
                                    value={skill.name} 
                                    onChangeText={(text) => handleSkillChange(index, 'name', text)} 
                                    editable={isEditing}
                                />
                                <View style={styles.skillValueContainer}>
                                    <TextInput
                                        style={styles.skillValue}
                                        value={skill.value}
                                        onChangeText={(value) => handleSkillChange(index, 'value', value)}
                                        editable={isEditing}
                                        keyboardType="numeric"
                                    />
                                </View>
                                {isEditing && (
                                    <TouchableOpacity onPress={() => handleRemoveSkill(index)}>
                                        <Icon name="minus-circle" size={24} color="red" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        ))}
                        {isEditing && (
                            <TouchableOpacity style={styles.addSkillButton} onPress={handleAddSkill}>
                                <Icon name="plus-circle" size={24} color="green" />
                                <Text>Adicionar Perícia</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <View style={styles.buttonContainer}>
                    {isEditing ? (
                        <>
                            <Button title="Salvar" onPress={handleSave} />
                            <Button title="Cancelar" onPress={handleCancel} />
                        </>
                    ) : (
                        <Button title="Editar" onPress={() => setIsEditing(true)} />
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = {
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    header: {
        marginBottom: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 35,
        fontWeight: 'bold',
        color: '#333',
    },
    characterContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    characterImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 2,
        borderColor: '#ddd',
    },
    characterName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    deleteButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    detailsContainer: {
        marginVertical: 15,
    },
    sectionContainer: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    label: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    attributesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    attributeBox: {
        width: '30%',
        marginBottom: 10,
    },
    attributeName: {
        fontSize: 14,
        color: '#666',
    },
    attributeValue: {
        height: 40,
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingLeft: 10,
        fontSize: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    statsColumn: {
        fontSize: 16,
        color: '#333',
    },
    input: {
        width: '60%',
        padding: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    addSkillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    skillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
      skillValueContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingVertical: 10,
    },
    skillValue: {
        width: '60%',
        textAlign: 'center',
        fontSize: 16,
    },
    skillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addSkillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    
      skillValueContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingVertical: 10,
    },
    skillValue: {
        width: '60%',
        textAlign: 'center',
        fontSize: 16,
    },
    skillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addSkillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    
      skillValueContainer: {
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
        paddingVertical: 10,
    },
    skillValue: {
        width: '60%',
        textAlign: 'center',
        fontSize: 16,
    },
    skillContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    addSkillButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    

};

export default CharacterDetails;
