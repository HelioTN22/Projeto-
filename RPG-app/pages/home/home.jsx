import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    Animated, 
    Easing, 
    Modal, 
    TextInput, 
    Button, 
    FlatList, 
    ImageBackground 
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import styles from './home-styles';

const Home = ({ navigation }) => {
    const [scaleValue] = useState(new Animated.Value(1));
    const [rotateValue] = useState(new Animated.Value(0));  
    const [modalVisible, setModalVisible] = useState(false);
    const [newCharacterName, setNewCharacterName] = useState('');
    const [newCharacterImage, setNewCharacterImage] = useState(null);
    const [characters, setCharacters] = useState([]);
    const [diceResult, setDiceResult] = useState([]);
    const [diceType, setDiceType] = useState('d4');
    const [numDice, setNumDice] = useState(1);
    const [diceSelectorVisible, setDiceSelectorVisible] = useState(false);

    useEffect(() => {
        const loadCharacters = async () => {
            try {
                const savedCharacters = await AsyncStorage.getItem('characters');
                if (savedCharacters !== null) {
                    setCharacters(JSON.parse(savedCharacters));
                }
            } catch (error) {
                console.error("Erro ao carregar personagens:", error);
            }
        };
        loadCharacters();
    }, []);

    const saveCharacters = async (charactersList) => {
        try {
            await AsyncStorage.setItem('characters', JSON.stringify(charactersList));
        } catch (error) {
            console.error("Erro ao salvar personagens:", error);
        }
    };

    const handlePressIn = () => {
        Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Precisamos de permissões de acesso à galeria!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 1,
        });
        if (result.canceled) {
            console.log("Seleção de imagem cancelada");
            return;
        }
        if (result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log("Imagem selecionada:", uri);
            setNewCharacterImage(uri);
        }
    };

    const handleAddCharacter = async () => {
        if (!newCharacterName || !newCharacterImage) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        const newCharacter = {
            id: Date.now().toString(),
            name: newCharacterName,
            image: newCharacterImage,
            life: 0,
            CA: 0,
            mana: 0,
            items: '',
            skills: [],
        };
        const updatedCharacters = [...characters, newCharacter];
        setCharacters(updatedCharacters);
        await saveCharacters(updatedCharacters);
        alert('Personagem adicionada com sucesso!');
        setModalVisible(false);
        setNewCharacterName('');
        setNewCharacterImage(null);
    };

    const handleDeleteCharacter = async (id) => {
        const updatedCharacters = characters.filter(character => character.id !== id);
        setCharacters(updatedCharacters);
        await saveCharacters(updatedCharacters);
    };

    const renderCharacter = ({ item }) => (
        <View style={styles.characterContainer}>
            <Image source={{ uri: item.image }} style={styles.characterImage} />
            <Text style={styles.characterName}>{item.name}</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => handleDeleteCharacter(item.id)} style={styles.iconContainer}>
                    <Icon name="trash" size={20} color="red" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('CharacterDetails', { character: item })} style={styles.iconContainer}>
                    <Text style={styles.detailsText}>Detalhes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const rollDice = () => {
        Animated.timing(rotateValue, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start(() => {
            rotateValue.setValue(0); 

            const results = [];
            for (let i = 0; i < numDice; i++) {
                let sides;
                if (diceType === 'd4') sides = 4;
                if (diceType === 'd6') sides = 6;
                if (diceType === 'd8') sides = 8;
                if (diceType === 'd10') sides = 10;
                if (diceType === 'd12') sides = 12;
                if (diceType === 'd20') sides = 20;

                const result = Math.floor(Math.random() * sides) + 1; 
                results.push(result);
            }
            setDiceResult(results); 
        });
    };

    const closeDiceResult = () => {
        setDiceResult([]);
    };

    const toggleDiceSelector = () => {
        setDiceSelectorVisible(!diceSelectorVisible); 
    };

    const incrementDice = () => {
        setNumDice(prev => prev + 1); 
    };

    const decrementDice = () => {
        setNumDice(prev => (prev > 1 ? prev - 1 : 1)); 
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                <ImageBackground
                    source={require('../../Imagem/Fundohome.png')}
                    style={{ flex: 1 }}
                >
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Adicionar Personagem</Text>
                        </View>
                    </View>
                    <FlatList
                        data={characters}
                        renderItem={renderCharacter}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.characterList}
                    />
                    {diceResult.length > 0 && (
                        <View style={styles.diceResultContainer}>
                            <Text style={styles.diceResultText}>Resultado: {diceResult.join(', ')}</Text>
                            <TouchableOpacity onPress={closeDiceResult} style={styles.closeButton}>
                                <Text style={styles.closeButtonText}>Fechar</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.bottomNav}>
                        <TouchableOpacity style={styles.navButtonHome} onPress={() => navigation.navigate('Home')}>
                            <Icon name="home" size={28} color="#000" />
                        </TouchableOpacity>
                        <Animated.View style={[styles.navButtonAddContainer, { transform: [{ scale: scaleValue }] }]}>
                            <TouchableOpacity
                                style={styles.navButtonAdd}
                                onPressIn={handlePressIn}
                                onPressOut={handlePressOut}
                                onPress={() => setModalVisible(true)}
                            >
                                <Icon name="plus" size={28} color="#000" />
                            </TouchableOpacity>
                        </Animated.View>
                        <TouchableOpacity style={styles.navButtonDice} onPress={toggleDiceSelector}>
                            <Icon name="dice" size={28} color="#000" />
                        </TouchableOpacity>
                    </View>

                    {/* Modal de Seleção de Dados */}
                    <Modal transparent={true} visible={diceSelectorVisible} onRequestClose={toggleDiceSelector}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalTitle}>Escolha o Dado</Text>
                                <Picker
                                    selectedValue={diceType}
                                    style={styles.picker}
                                    onValueChange={(itemValue) => setDiceType(itemValue)}
                                >
                                    <Picker.Item label="D4" value="d4" />
                                    <Picker.Item label="D6" value="d6" />
                                    <Picker.Item label="D8" value="d8" />
                                    <Picker.Item label="D10" value="d10" />
                                    <Picker.Item label="D12" value="d12" />
                                    <Picker.Item label="D20" value="d20" />
                                </Picker>
                                <View style={styles.diceNumberContainer}>
                                    <TouchableOpacity onPress={decrementDice} style={styles.diceControl}>
                                        <Text style={styles.diceControlText}>-</Text>
                                    </TouchableOpacity>
                                    <Text style={styles.diceCount}>{numDice} dados</Text>
                                    <TouchableOpacity onPress={incrementDice} style={styles.diceControl}>
                                        <Text style={styles.diceControlText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                                <Button title="Girar" onPress={rollDice} />
                                <Button title="Fechar" onPress={toggleDiceSelector} />
                            </View>
                        </View>
                    </Modal>

                    {/* Modal de Adicionar Personagem */}
                    <Modal transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <TextInput
                                    placeholder="Nome do personagem"
                                    value={newCharacterName}
                                    onChangeText={setNewCharacterName}
                                    style={styles.input}
                                />
                                <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                                    <Text style={styles.imagePickerText}>Selecionar Imagem</Text>
                                </TouchableOpacity>
                                <Button title="Adicionar Personagem" onPress={handleAddCharacter} />
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </View>
        </SafeAreaView>
    );
};

export default Home;

